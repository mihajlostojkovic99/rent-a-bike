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
import { muiTheme } from '../../utils/datePicker';
import Reviews from '../../components/reviews';

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

  console.log(
    'startTime: ',
    new Date(parseInt(router.query.startTime as string)),
  );

  const [startTime, setStartTime] = useState<Date | null | undefined>(
    router.query.startTime
      ? new Date(parseInt(router.query.startTime as string))
      : new Date(),
  );
  const [endTime, setEndTime] = useState<Date | null | undefined>(
    router.query.endTime
      ? new Date(parseInt(router.query.endTime as string))
      : new Date(),
  );

  const [helmet, setHelmet] = useState(false);
  const [childSeat, setChildSeat] = useState(false);

  const [total, setTotal] = useState(bike.pricePerHour);

  // console.log(locationId);
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
            <div className="mt-8 flex items-center justify-between">
              <div className="flex w-fit flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-justBlack lg:font-normal">
                    Pick up time:
                  </div>
                  <MyDateTimePicker
                    value={startTime}
                    onChange={(newValue) => {
                      setStartTime(newValue);
                    }}
                    theme={muiTheme}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-justBlack lg:font-normal">
                    Return time:
                  </div>
                  <MyDateTimePicker
                    value={endTime}
                    onChange={(newValue) => {
                      setEndTime(newValue);
                    }}
                    theme={muiTheme}
                  />
                </div>
              </div>
              <div className="flex h-full flex-col justify-evenly">
                <label className="label mt-5 mb-2 ml-1 cursor-pointer justify-start p-0 lg:mt-0">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-accent checkbox-sm mr-2"
                    name="returnDay"
                    id="returnDay"
                    checked={helmet}
                    onChange={() => setHelmet(!helmet)}
                  />
                  <span>Helmet</span>
                </label>

                <label className="label mt-5 mb-2 ml-1 cursor-pointer justify-start p-0 lg:mt-0">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-accent checkbox-sm mr-2"
                    name="returnDay"
                    id="returnDay"
                    checked={childSeat}
                    onChange={() => setChildSeat(!childSeat)}
                  />
                  <span>Child seat</span>
                </label>
              </div>
              <div className="text-2xl font-extrabold tracking-tighter">
                Total: ${total}
              </div>
              <button className="btn btn-accent btn-wide h-full text-3xl normal-case">
                Proceed
              </button>
            </div>
            <Reviews bike={bike} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BikePage;