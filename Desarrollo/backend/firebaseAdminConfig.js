// firebaseAdminConfig.js
import admin from "firebase-admin";
import serviceAccount from "./salfa-capacitaciones-firebase-adminsdk-ivkuy-ff2a2488af.json" assert { type: "json" }; // Añade el assert { type: "json" }

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();

export { auth };
