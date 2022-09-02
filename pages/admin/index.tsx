import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout';
import Searchbox from '../../components/searchbox';
import bike from '../public/home_bike.jpg';
import { useAuth } from '../../utils/useAuth';
import { AuthCheck } from '../../utils/authCheck';
import { verifyIdToken } from '../../utils/firebaseAdmin';
import { db, userToJSON } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import nookies from 'nookies';

const Admin: NextPage = () => {
  const { user, userData } = useAuth();
  console.log(userData?.isAdmin);
  return (
    <Layout>
      <div>Dje si adminee {userData?.displayName}!</div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    const userSnap = await getDoc(doc(db, 'users', uid));

    const isAdmin: boolean | undefined = userSnap.data()?.isAdmin;

    if (!isAdmin) {
      console.log('user is not admin');
      return {
        redirect: {
          destination: 'home',
        },
        props: [],
      };
    }

    console.log('all ok ADMIN INDEX');

    return {
      props: {},
    };
  } catch (err) {
    console.log('ADMIN INDEX PAGE', err);
    // nookies.destroy(context, 'token');
    return {
      redirect: {
        destination: '/',
      },
      props: [],
    };
  }
};

export default Admin;
