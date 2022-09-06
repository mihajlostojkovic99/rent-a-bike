import { LightningBoltIcon } from '@heroicons/react/solid';
import {
  collectionGroup,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';
import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import { Bike, Location } from '../../lib/dbTypes';
import { db } from '../../utils/firebase';
import { useEffect, useState } from 'react';
import { loadLocations } from '../../components/searchbox';
import Select from 'react-select/';
import { PulseLoader } from 'react-spinners';
import MyDateTimePicker from '../../components/myDateTimePicker';

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

export const selectStylesGray = {
  control: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
    ...styles,
    'backgroundColor': '#E3E3E3',
    'height': '40px',
    'width': '100%',
    '@media (min-width: 1024px)': {
      width: '14rem',
    },
    'border': '1px solid rgb(0 0 0 / 0.23)',
  }),
  menu: (styles: any) => ({ ...styles, backgroundColor: '#E3E3E3' }),
  option: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
    ...styles,
    backgroundColor: isSelected
      ? '#008CEE'
      : isFocused && 'rgb(0 140 238 / 0.1)',
  }),
};

type BikePageProps = {
  bike: Bike;
};

const BikePage: NextPage<BikePageProps> = ({ bike }: BikePageProps) => {
  const router = useRouter();
  const locationId = router.query.locationId;

  const [locations, setLocations] = useState<
    | {
        label: string;
        value: string;
      }[]
    | undefined
  >();

  const [startTime, setStartTime] = useState<Date | null | undefined>();

  useEffect(() => {
    const fetchLocations = async () => {
      setLocations(await loadLocations());
    };
    fetchLocations();
  }, []);

  console.log(locationId);
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
              <div className="divider divider-horizontal h-8"></div>
              <div>
                <span className="font-bold">Speeds: </span> {bike.speeds}
              </div>
              <div className="divider divider-horizontal h-8"></div>
              <div>
                <span className="font-bold">Brakes: </span> {bike.brakes}
              </div>
              <div className="divider divider-horizontal h-8"></div>
              <div className="flex items-center">
                <div className="mr-1 font-bold">Electric: </div>{' '}
                {bike.isElectric ? (
                  <div className="flex items-center">
                    Yes
                    <div className="stroke-black text-electricGreen">
                      <LightningBoltIcon className="h-6 w-6" />
                    </div>
                  </div>
                ) : (
                  <div>No</div>
                )}
              </div>
            </div>
            <div>
              {!locations && <PulseLoader color="#008CEE" />}
              {locations && (
                <div className="flex">
                  <Select
                    options={locations}
                    defaultValue={locations.find((val) => {
                      if (val.value === locationId) return true;
                      else return false;
                    })}
                    styles={selectStylesGray}
                  />
                  {/* <MyDateTimePicker
                    value={startTime}
                    onChange={(val) => {
                      setStartTime(val);
                    }}
                  /> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BikePage;
