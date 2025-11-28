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

    console.log(`🔍 Attempting to update user with ID: ${id}`);

    // Get Firestore instance with mainstore database
    const app = getApps()[0];
    const db = getFirestore(app, "mainstore");

    // Update the user document (email is the document ID)
    const userRef = db.collection("users").doc(id);

    // Check if document exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      console.error(`❌ No user found with id: ${id}`);
      return NextResponse.json(
        { error: `User with id ${id} not found` },
        { status: 404 }
      );
    }

    await userRef.update(updateData);

    // If banning user, also add to banned collection
    if (updateData.banned === true) {
      const userData = userDoc.data();
      const bannedRef = db.collection("banned").doc(id);
      await bannedRef.set({
        ...userData,
        banned: true,
      });
      console.log(`✅ User ${id} added to banned collection`);
    }

    console.log(`✅ Updated user ${id} in Firestore`);

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      id,
    });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
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

    console.log(`🔍 Attempting to delete user with ID: ${id}`);

    // Get Firestore instance with mainstore database
    const app = getApps()[0];
    const db = getFirestore(app, "mainstore");

    // Delete the user document (email is the document ID)
    const userRef = db.collection("users").doc(id);

    // Check if document exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      console.error(`❌ No user found with id: ${id}`);
      return NextResponse.json(
        { error: `User with id ${id} not found` },
        { status: 404 }
      );
    }

    await userRef.delete();

    console.log(`✅ Deleted user ${id} from Firestore`);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      id,
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
