import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as serviceAccount from "../../../../rocktags-testing-firebase-adminsdk-fbsvc-e48f186959.json";

// Initialize Firebase Admin SDK
let app;
if (!getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccount as any),
  });
} else {
  app = getApps()[0];
}

// Use the mainstore database
const db = getFirestore(app, "mainstore");

export async function GET() {
  try {
    console.log("🔍 Attempting to fetch banned users from Firestore...");
    const bannedCollection = db.collection("banned");
    const snapshot = await bannedCollection.get();

    console.log(`📊 Found ${snapshot.size} documents in banned collection`);

    if (snapshot.empty) {
      console.log("⚠️ Banned collection is empty");
      return NextResponse.json([]);
    }

    const bannedUsers = snapshot.docs.map((doc) => {
      const data = doc.data();
      console.log(`👤 Banned user doc ID: ${doc.id}`, data);
      return {
        id: doc.id,
        email: doc.id, // The document ID is the email
        ...data,
        banned: true, // Mark as banned
      };
    });

    console.log("✅ Successfully fetched banned users:", bannedUsers.length);
    return NextResponse.json(bannedUsers);
  } catch (error: any) {
    console.error("❌ Error fetching banned users:", error);
    console.error("Error code:", error.code);
    console.error("Error details:", error.details);
    return NextResponse.json(
      {
        error: "Failed to fetch banned users",
        message: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
