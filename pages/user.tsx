import { NextPage } from 'next';
import Image from 'next/image';
import Layout from '../components/layout';
import { useAuth } from '../utils/useAuth';

const UserPage: NextPage = () => {
  const { user } = useAuth();

  return (
    <>
      <Layout>
        <div className="min-h-screen lg:mx-auto lg:max-w-7xl">
          {user?.displayName}
        </div>
      </Layout>
    </>
  );
};

export default UserPage;
