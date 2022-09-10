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
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import { Location } from '../../lib/dbTypes';
import Select from 'react-select';
import { useState } from 'react';
import EditLocation from '../../components/admin/editLocation';
import AddLocation from '../../components/admin/addLocation';

type LocationsProps = {
  locations: Location[];
};

const Locations: NextPage<LocationsProps> = ({ locations }: LocationsProps) => {
  return (
    <Layout>
      <div className="mx-auto min-h-screen tracking-tighter text-justBlack lg:max-w-7xl">
        <div className="mx-2 flex gap-4 rounded-md bg-offWhite p-3 lg:mx-0 lg:rounded-3xl lg:p-6">
          <EditLocation locations={locations} />
          <AddLocation locations={locations} />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    // console.log('Admin token is: ', cookies.token.substring(0, 10), '...');
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    const [userSnap, locationsSnap] = await Promise.all([
      getDoc(doc(db, 'users', uid)),
      getDocs(collection(db, 'locations')),
    ]);

    const isAdmin: boolean | undefined = userSnap.data()?.isAdmin;

    if (!isAdmin) {
      // console.log('user is not admin');
      return {
        redirect: {
          destination: '/',
        },
        props: {},
      };
    }

    const locations: Location[] = [];
    locationsSnap.forEach((loc) => {
      locations.push({
        id: loc.id,
        city: loc.data().city,
        place: loc.data().place,
      });
    });

    return {
      props: {
        locations: locations,
      },
    };
  } catch (err) {
    // console.log('ADMIN INDEX PAGE', err);
    return {
      redirect: {
        destination: '/',
      },
      props: {},
    };
  }
};

export default Locations;
