import type { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../../../utils/firebaseAdmin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { uid } = req.query;
  if (typeof uid !== 'string') return;

  //   const firestore = admin.firestore();

  try {
    await admin.auth().deleteUser(uid);
    res.status(200).json('User deleted');
  } catch (error: any) {
    console.error(error);
    res.status(500).json(`User deletion failed: ${error.code}`);
  }
}
