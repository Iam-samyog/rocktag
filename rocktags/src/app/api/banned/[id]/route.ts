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

    console.log(`🔍 Attempting to unban user with ID: ${id}`);

    // Get Firestore instance with mainstore database
    const app = getApps()[0];
    const db = getFirestore(app, "mainstore");

    // If unbanning user, update users collection and remove from banned collection
    if (updateData.banned === false) {
      const bannedRef = db.collection("banned").doc(id);
      const bannedDoc = await bannedRef.get();

      if (!bannedDoc.exists) {
        console.error(`❌ No banned user found with id: ${id}`);
        return NextResponse.json(
          { error: `Banned user with id ${id} not found` },
          { status: 404 }
        );
      }

      const userData = bannedDoc.data();

      // Update the user in users collection
      const userRef = db.collection("users").doc(id);
      await userRef.set({
        ...userData,
        banned: false,
      });

      // Remove from banned collection
      await bannedRef.delete();

      console.log(`✅ User ${id} unbanned and removed from banned collection`);
    }

    return NextResponse.json({
      success: true,
      message: "User unbanned successfully",
      id,
    });
  } catch (error) {
    console.error("❌ Error unbanning user:", error);
    return NextResponse.json(
      { error: "Failed to unban user" },
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

    console.log(`🔍 Attempting to delete banned user with ID: ${id}`);

    // Get Firestore instance with mainstore database
    const app = getApps()[0];
    const db = getFirestore(app, "mainstore");

    // Delete from banned collection
    const bannedRef = db.collection("banned").doc(id);

    const bannedDoc = await bannedRef.get();
    if (!bannedDoc.exists) {
      console.error(`❌ No banned user found with id: ${id}`);
      return NextResponse.json(
        { error: `Banned user with id ${id} not found` },
        { status: 404 }
      );
    }

    await bannedRef.delete();

    console.log(`✅ Deleted banned user ${id} from Firestore`);

    return NextResponse.json({
      success: true,
      message: "Banned user deleted successfully",
      id,
    });
  } catch (error) {
    console.error("❌ Error deleting banned user:", error);
    return NextResponse.json(
      { error: "Failed to delete banned user" },
      { status: 500 }
    );
  }
}
