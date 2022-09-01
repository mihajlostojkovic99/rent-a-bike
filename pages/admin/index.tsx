import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout';
import Searchbox from '../../components/searchbox';
import bike from '../public/home_bike.jpg';
import { useAuth } from '../../utils/useAuth';
import { AuthCheck } from '../../utils/authCheck';

const Admin: NextPage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <AuthCheck>
        <div>Hello adminee!</div>
      </AuthCheck>
    </Layout>
  );
};

export default Admin;
