import { beforeUserCreated, HttpsError } from "firebase-functions/v2/identity";
import * as functions from 'firebase-functions/v1';
import 'firebase-functions/logger/compat';
import { admin_auth, admin_db } from "./firebase-admin";

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
  try {
    const uid = user.uid;
    await admin_auth.setCustomUserClaims(uid, { user: true });

    const userData = {
        role: 'user',
    };

    await admin_db.collection('users').doc(user.email!).set(userData)
    console.log(`[V1] Creating user profile for UID: ${uid}`);
  } catch (err) {
    console.error(err);
  }
});
