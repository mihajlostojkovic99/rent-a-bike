import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { bikeId } = req.query;
  console.log('Revalidating page: /bike/', bikeId);
  let revalidated = false;
  try {
    await res.revalidate(`/bikes/${bikeId}`);
    revalidated = true;
  } catch (err) {
    console.log(err);
  }
  res.json({ revalidated });
}
