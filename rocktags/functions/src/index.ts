// import {setGlobalOptions} from "firebase-functions";
// import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";

import { beforeUserCreated, HttpsError } from "firebase-functions/v2/identity";
import * as functions from 'firebase-functions/v1';
import {getFirestore} from 'firebase-admin/firestore';
import { initializeApp } from "firebase-admin/app";
import 'firebase-functions/logger/compat';

// Initialize Admin SDK and Firestore
const firebaseApp = initializeApp();
export const db = getFirestore(firebaseApp, 'mainstore');

export const enforceMavsEmail = beforeUserCreated(async (event) => {
  const user = event.data;
  const now = new Date();
  console.log(`[${now.toISOString()}] attempting sign up with email ${user?.email}`);
  if (!user?.email?.endsWith("@mavs.uta.edu")) {
    console.log(`[${now.toISOString()}] invalid email ${user?.email}`);
    throw new HttpsError("invalid-argument", "Only @mavs.uta.edu emails are allowed");
  }
});

export const createFirestoreUser = functions.auth.user().onCreate(async (user) => {
    // The user object is the same UserRecord you'd get from the Admin SDK
    const { uid, email, displayName } = user;
    
    // Data to write to Firestore
    const userData = {
        displayName: displayName || 'New User',
        role: 'user',
    };

    // Use the Auth UID as the document ID for the user profile
    await db.collection('users').doc(email!).set(userData)
    .then(() => {
        console.log("[V1]Document successfully written!");
    })
    .catch((error) => {
        console.error("[V1] Error writing document: ", error);
    });

    console.log(`[V1] Creating user profile for UID: ${uid}`);
});
