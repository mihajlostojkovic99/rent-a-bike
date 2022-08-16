import admin from 'firebase-admin';
const serviceAccount = require('../secret.json');

export const verifyIdToken = (token: string) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://diplomski-2022.firebaseio.com',
    });
  }

  return admin
    .auth()
    .verifyIdToken(token)
    .catch((error: any) => {
      throw error;
    });
};