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
    console.log("🔍 Attempting to fetch cats from Firestore...");
    const catsCollection = db.collection("cats");
    const snapshot = await catsCollection.get();

    console.log(`📊 Found ${snapshot.size} documents in cats collection`);

    if (snapshot.empty) {
      console.log("⚠️ Cats collection is empty");
      return NextResponse.json([]);
    }

    const cats = snapshot.docs.map((doc) => {
      const data = doc.data();
      console.log(`🐱 Cat doc ID: ${doc.id}`, data);
      return {
        id: doc.id,
        ...data,
      };
    });

    // Sort cats by id in ascending order
    cats.sort((a, b) => {
      const idA = typeof a.id === "number" ? a.id : parseInt(a.id) || 0;
      const idB = typeof b.id === "number" ? b.id : parseInt(b.id) || 0;
      return idA - idB;
    });

    console.log("✅ Successfully fetched cats:", cats.length);
    return NextResponse.json(cats);
  } catch (error: any) {
    console.error("❌ Error fetching cats:", error);
    console.error("Error code:", error.code);
    console.error("Error details:", error.details);
    return NextResponse.json(
      {
        error: "Failed to fetch cats",
        message: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
