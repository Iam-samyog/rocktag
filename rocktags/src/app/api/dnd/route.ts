import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK with environment variables
let app;
if (!getApps().length) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    } as any),
  });
} else {
  app = getApps()[0];
}

// Use the mainstore database
const db = getFirestore(app, "mainstore");

export async function GET() {
  try {
    console.log("🔍 Attempting to fetch DND times from Firestore...");
    const dndCollection = db.collection("dnd");
    const snapshot = await dndCollection.get();

    console.log(`📊 Found ${snapshot.size} documents in dnd collection`);

    if (snapshot.empty) {
      console.log("⚠️ DND collection is empty");
      return NextResponse.json([]);
    }

    const dndTimes = snapshot.docs.map((doc) => {
      const data = doc.data();
      console.log(`📅 DND doc ID: ${doc.id}`, data);
      return {
        id: doc.id,
        ...data,
      };
    });

    console.log("✅ Successfully fetched DND times:", dndTimes.length);
    return NextResponse.json(dndTimes);
  } catch (error: any) {
    console.error("❌ Error fetching DND times:", error);
    console.error("Error code:", error.code);
    console.error("Error details:", error.details);
    return NextResponse.json(
      {
        error: "Failed to fetch DND times",
        message: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
