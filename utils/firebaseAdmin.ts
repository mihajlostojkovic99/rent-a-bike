import admin from 'firebase-admin';
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT as string,
);

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

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://diplomski-2022.firebaseio.com',
    });
  }
} catch (error: any) {
  if (!/already exists/u.test(error.message)) {
    console.error(
      'Firebase admin for API routes initialization error',
      error.stack,
    );
  }
}

export default admin;
