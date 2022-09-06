import type { GetServerSideProps, NextPage } from 'next';
import Layout from '../../components/layout';
import { useAuth } from '../../utils/useAuth';
import { verifyIdToken } from '../../utils/firebaseAdmin';
import { db } from '../../utils/firebase';
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import nookies from 'nookies';
import BikeStock from '../../components/admin/bikeStock';
import AddBike from '../../components/admin/addBike';
import { Bike, Location } from '../../lib/dbTypes';

type BikesProps = {
  locations: Location[];
  bikes: Bike[];
};

const Bikes: NextPage<BikesProps> = ({ locations, bikes }: BikesProps) => {
  const { user, userData } = useAuth();

  return (
    <Layout>
      <div className="mx-auto min-h-screen tracking-tighter text-justBlack lg:max-w-7xl">
        <div className="mx-2 flex flex-col gap-6 rounded-md bg-offWhite p-3 lg:mx-0 lg:grid lg:grid-cols-[1fr_1fr] lg:grid-rows-[2fr_1fr] lg:gap-6 lg:rounded-3xl lg:p-6">
          <AddBike className="col-start-1 col-end-3" />
          <BikeStock locations={locations} bikes={bikes} />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    // console.log('BIKES token is: ', cookies.token.substring(0, 10), '...');
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    const userSnap = await getDoc(doc(db, 'users', uid));

    const isAdmin: boolean | undefined = userSnap.data()?.isAdmin;

    if (!isAdmin) {
      return {
        redirect: {
          destination: '/',
        },
        props: [],
      };
    }

    const locations: Location[] = [];
    const locationsSnap = await getDocs(collection(db, 'locations'));

    locationsSnap.forEach((locSnap) => {
      locations.push({
        id: locSnap.id,
        city: locSnap.data().city,
        place: locSnap.data().place,
      });
    });

    const bikes: Bike[] = [];
    const modelsSnap = await getDocs(collectionGroup(db, 'models'));
    modelsSnap.forEach((bike) => {
      bikes.push(bike.data() as Bike);
    });

    return {
      props: {
        locations: locations,
        bikes: bikes,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/',
      },
      props: [],
    };
  }
};

export default Bikes;
