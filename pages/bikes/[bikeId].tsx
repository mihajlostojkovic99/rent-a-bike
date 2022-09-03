import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';

const BikePage: NextPage = () => {
  const router = useRouter();
  const { bikeId } = router.query;
  return <Layout>This is the bike page for {bikeId}</Layout>;
};

export default BikePage;
