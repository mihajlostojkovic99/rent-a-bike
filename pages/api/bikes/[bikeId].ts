import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { bikeId } = req.query;
  //   if (typeof bikeId !== 'string') {
  //     res.status(500).json('BIKEID ERROR');
  //     return;
  //   }
  //   bikeId = bikeId.replace(/\s+/g, '');
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
