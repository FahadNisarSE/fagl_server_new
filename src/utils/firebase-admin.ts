import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Replace escaped newline characters
    }),
    databaseURL:
      "https://finalyear-d910b-default-rtdb.asia-southeast1.firebasedatabase.app", // You can also put this in your .env file
  });
}

export const verifyIdToken = (token: string) => {
  return admin.auth().verifyIdToken(token);
};

export const getUser = (uid: string) => {
  return admin.auth().getUser(uid);
};
