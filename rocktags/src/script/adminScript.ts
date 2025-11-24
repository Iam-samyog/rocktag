import admin from "firebase-admin";
import serviceAccount from "../../serviceAccount.json"; 

// Define the type for the service account
const serviceAccountParams = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientX509CertUrl: serviceAccount.client_x509_cert_url,
};

// check if the app is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountParams),
  });
}

async function grantAdminToAllUsers() {
  try {
    const result = await admin.auth().listUsers(1000);
    let count = 0;
    for (const user of result.users) {
      if (user.customClaims && user.customClaims.admin === true) {
        console.log(`Skipping UID ${user.uid}: claim already set.`);
      } else {
        // Set the custom claim
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        console.log(`Successfully set 'admin: true' for UID: ${user.uid}`);
        ++count;
      }

    };

    console.log('total admin set: ' + count);
  } catch (err) {
    console.log(err);
  }
}

grantAdminToAllUsers();