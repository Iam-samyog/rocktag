import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK with environment variables
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const updateData = await request.json();

    console.log(`🔍 Attempting to update cat with ID: ${id}`);

    // Get Firestore instance with mainstore database
    const app = getApps()[0];
    const db = getFirestore(app, "mainstore");

    // First, find the document by searching for the matching id field
    const catsSnapshot = await db
      .collection("cats")
      .where("id", "==", parseInt(id))
      .get();

    if (catsSnapshot.empty) {
      console.error(`❌ No cat found with id: ${id}`);
      return NextResponse.json(
        { error: `Cat with id ${id} not found` },
        { status: 404 }
      );
    }

    // Get the document ID (which is the cat's name)
    const docId = catsSnapshot.docs[0].id;
    console.log(`📝 Found cat document: ${docId}`);

    // Update the cat document using the document ID
    const catRef = db.collection("cats").doc(docId);

    // Remove the id field from update data if present
    const { id: _, ...dataToUpdate } = updateData;

    await catRef.update(dataToUpdate);

    console.log(`✅ Updated cat ${docId} (ID: ${id}) in Firestore`);

    return NextResponse.json({
      success: true,
      message: "Cat updated successfully",
      id,
    });
  } catch (error) {
    console.error("❌ Error updating cat:", error);
    return NextResponse.json(
      { error: "Failed to update cat" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    console.log(`🔍 Attempting to delete cat with ID: ${id}`);

    // Get Firestore instance with mainstore database
    const app = getApps()[0];
    const db = getFirestore(app, "mainstore");

    // First, find the document by searching for the matching id field
    const catsSnapshot = await db
      .collection("cats")
      .where("id", "==", parseInt(id))
      .get();

    if (catsSnapshot.empty) {
      console.error(`❌ No cat found with id: ${id}`);
      return NextResponse.json(
        { error: `Cat with id ${id} not found` },
        { status: 404 }
      );
    }

    // Get the document ID (which is the cat's name)
    const docId = catsSnapshot.docs[0].id;
    console.log(`📝 Found cat document: ${docId}`);

    // Delete the cat document using the document ID
    const catRef = db.collection("cats").doc(docId);
    await catRef.delete();

    console.log(`✅ Deleted cat ${docId} (ID: ${id}) from Firestore`);

    return NextResponse.json({
      success: true,
      message: "Cat deleted successfully",
      id,
    });
  } catch (error) {
    console.error("❌ Error deleting cat:", error);
    return NextResponse.json(
      { error: "Failed to delete cat" },
      { status: 500 }
    );
  }
}
