import {
  collectionGroup,
  DocumentData,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Layout from '../../components/layout';
import { Bike } from '../../lib/dbTypes';
import { db } from '../../utils/firebase';

export async function getStaticPaths() {
  const querySnap = await getDocs(collectionGroup(db, 'models'));
  const paths: string[] = [];
  querySnap.forEach((bike) => {
    paths.push(`/bikes/${bike.data().id}`);
  });

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const bikeId = params?.bikeId;
  const q = query(
    collectionGroup(db, 'models'),
    where('id', '==', bikeId),
    limit(1),
  );

  const querySnap = await getDocs(q);
  const bikeData = querySnap.docs[0].data() as Bike;

  return {
    props: {
      bike: bikeData,
    },
  };
};

type BikePageProps = {
  bike: Bike;
};

const BikePage: NextPage<BikePageProps> = ({ bike }: BikePageProps) => {
  return (
    <Layout>
      <div className="mt-56">
        <div className="relative mx-auto mt-8 flex max-w-7xl flex-wrap gap-8 rounded-lg bg-offWhite p-4 text-base text-black lg:rounded-3xl lg:p-8">
          <div className="absolute -top-48 left-1/2 mx-auto h-[600px] w-[1100px] -translate-x-1/2">
            <div className="relative h-full w-full">
              <Image
                src={bike.photoURL!}
                alt="Bike image"
                layout="fill"
                objectFit="contain"
                objectPosition="bottom"
                priority
              />
            </div>
          </div>
          <div className="mt-[350px] flex w-full flex-col">
            <div className="mx-auto text-4xl font-extrabold">
              {bike.brand} {bike.model}{' '}
              <span className="text-justBlack/40">{bike.year}</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-evenly">
              <div>
                <span className="font-bold">Type: </span> {bike.type}
              </div>
              {/* <div> | </div> */}
              <div className="divider divider-horizontal h-8"></div>
              <div>
                <span className="font-bold">Speeds: </span> {bike.speeds}
              </div>
              <div className="divider divider-horizontal h-8"></div>
              <div>
                <span className="font-bold">Brakes: </span> {bike.brakes}
              </div>
              <div className="divider divider-horizontal h-8"></div>
              <div>
                <span className="font-bold">Type: </span> {bike.type}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BikePage;
