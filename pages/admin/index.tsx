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
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import { EmployeeData, Reservation } from '../../lib/dbTypes';
import {
  BanknotesIcon,
  UserGroupIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline';
import {
  compareAsc,
  endOfDay,
  endOfYesterday,
  Interval,
  isWithinInterval,
  lastDayOfMonth,
  startOfMonth,
  subDays,
} from 'date-fns';
import { Bike } from '../../lib/dbTypes';
import BikeCard from '../../components/bikeCard';

type AdminProps = {
  admin: EmployeeData;
  totalLocations: number;
  totalUsers: number;
  totalRevenue: number;
  futureReservations: number;
  todayReservationsJSON: string;
  totalBikes: number;
  activeBikes: number;
  newUsers: number;
  allBikes: Bike[];
  newReservations: number;
};

const Admin: NextPage<AdminProps> = ({
  admin,
  totalLocations,
  totalRevenue,
  totalUsers,
  futureReservations,
  todayReservationsJSON,
  totalBikes,
  activeBikes,
  newUsers,
  allBikes,
  newReservations,
}: AdminProps) => {
  const { user, userData } = useAuth();

  const todayReservations: Reservation[] = JSON.parse(todayReservationsJSON);

  return (
    <Layout>
      <div className="mx-auto tracking-tighter text-justBlack lg:max-w-7xl">
        <div className="mx-2 mb-4 flex flex-col gap-6 rounded-md bg-offWhite p-3 lg:mx-0 lg:rounded-3xl lg:p-6">
          <div className="text-3xl font-extrabold tracking-tighter">
            <span className="text-justBlack/40">Hello </span>
            {admin.displayName}
            <span className="text-justBlack/40">, this is your dashboard.</span>
          </div>
          <div className="stats stats-vertical bg-accentBlue/20 shadow 2xl:stats-horizontal">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <BanknotesIcon className="h-8 w-8" />
              </div>
              <div className="stat-title">Total revenue</div>
              <div className="stat-value">${totalRevenue}</div>
              <div className="stat-desc">Jun 1st - Today</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <UserGroupIcon className="h-8 w-8" />
              </div>
              <div className="stat-title">Clients</div>
              <div className="stat-value">{totalUsers}</div>
              <div className="stat-desc">↗︎ {newUsers} since last month</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <BuildingStorefrontIcon className="h-8 w-8" />
              </div>
              <div className="stat-title">Locations</div>
              <div className="stat-value">{totalLocations}</div>
              {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <ChartBarIcon className="h-8 w-8" />
              </div>
              <div className="stat-title">Reservations</div>
              <div className="stat-value">{futureReservations}</div>
              <div className="stat-desc">
                ↗︎ {newReservations} new since yesterday
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <PresentationChartLineIcon className="h-8 w-8" />
              </div>
              <div className="stat-title">Usage</div>
              <div className="stat-value">
                {activeBikes > 0 && '~'}
                {((activeBikes / totalBikes) * 100).toFixed(0)}% rented
              </div>
              <div className="stat-desc">
                {totalBikes - activeBikes} (
                {(100 - (activeBikes / totalBikes) * 100).toFixed(0)}%) bikes
                are free
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-md bg-accentBlue/20 p-3 shadow lg:rounded-3xl xl:p-6">
            <div className="mx-auto text-3xl font-extrabold tracking-tighter">
              All bikes.
            </div>
            <div className="flex flex-wrap gap-4">
              {allBikes.map((bike) => {
                return <BikeCard key={bike.id} bike={bike} />;
              })}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 rounded-md bg-accentBlue/20 p-3 shadow lg:rounded-3xl xl:p-6">
            {todayReservations.length === 0 ? (
              <div className="mx-auto text-3xl font-extrabold tracking-tighter">
                No reservations for today.
              </div>
            ) : (
              <div className="mx-auto text-3xl font-extrabold tracking-tighter">
                Upcoming reservations.
              </div>
            )}
            {todayReservations.map((res) => {
              return (
                <div
                  key={res.id}
                  className="flex w-full items-center justify-evenly bg-accentBlue/10 p-3 lg:rounded-3xl xl:p-6"
                >
                  <div>
                    <span className="font-bold">Location: </span> {res.location}
                  </div>
                  <div className="divider divider-horizontal h-10" />
                  <div>
                    <span className="font-bold">Bike: </span> {res.bikeModel}
                  </div>
                  <div className="divider divider-horizontal h-10" />
                  <div>
                    <span className="font-bold">When: </span>
                    {new Date(res.startDate.seconds * 1000).toLocaleTimeString(
                      'it-IT',
                    )}
                  </div>
                  <div className="divider divider-horizontal h-10" />
                  <div>
                    <span className="font-bold">Price: </span> ${res.bill}
                  </div>
                </div>
              );
            })}
          </div>
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

    const userSnap = await getDoc(doc(db, 'users', uid));

    const isAdmin: boolean | undefined = userSnap.data()?.isAdmin;

    if (!isAdmin) {
      console.log('user is not admin');
      return {
        redirect: {
          destination: '/',
        },
        props: {},
      };
    }

    const [reservationsSnap, usersSnap, locationsSnap, stockSnap, modelsSnap] =
      await Promise.all([
        getDocs(collectionGroup(db, 'reservations')),
        getDocs(query(collection(db, 'users'), orderBy('balance'))),
        getDocs(collection(db, 'locations')),
        getDocs(collection(db, 'stock')),
        getDocs(collectionGroup(db, 'models')),
      ]);

    const totalLocations = locationsSnap.size;
    const totalUsers = usersSnap.size;
    let totalRevenue = 0;
    let futureReservations = 0;
    let todayReservations: Reservation[] = [];
    let newReservations = 0;
    let activeBikes = 0;
    let newUsers = 0;

    const now = new Date();
    const yesterday = endOfYesterday();
    const lastMonthEnd = endOfDay(subDays(startOfMonth(new Date()), 1));

    usersSnap.forEach((user) => {
      // console.log(user.data());
      if (
        compareAsc(
          new Date((user.data().createdAt as Timestamp).seconds * 1000),
          lastMonthEnd,
        ) === 1
      ) {
        newUsers++;
      }
    });

    reservationsSnap.forEach((res) => {
      totalRevenue += res.data().bill;

      if (
        compareAsc(
          new Date((res.data().startDate as Timestamp).seconds * 1000),
          now,
        ) === 1
      ) {
        futureReservations++;
      }

      if (
        compareAsc(
          new Date((res.data().createdAt as Timestamp).seconds * 1000),
          yesterday,
        ) === 1
      ) {
        newReservations++;
      }

      if (
        compareAsc(
          new Date((res.data().startDate as Timestamp).seconds * 1000),
          new Date(),
        ) === 1
      ) {
        todayReservations.push({
          bikeId: res.data().bikeId,
          bikeModel: res.data().bikeModel,
          bill: res.data().bill,
          createdAt: res.data().createdAt,
          endDate: res.data().endDate,
          id: res.id,
          location: res.data().location,
          startDate: res.data().startDate,
          uid: res.data().uid,
        });
      }

      const interval: Interval = {
        start: new Date((res.data().startDate as Timestamp).seconds * 1000),
        end: new Date((res.data().endDate as Timestamp).seconds * 1000),
      };

      if (isWithinInterval(new Date(), interval)) {
        activeBikes++;
      }
    });

    let totalBikes = 0;
    stockSnap.forEach((stock) => {
      totalBikes += stock.data().total;
    });

    const allBikes: Bike[] = [];
    modelsSnap.forEach((bike) => {
      allBikes.push({
        brakes: bike.data().brakes,
        brand: bike.data().brand,
        id: bike.id,
        isElectric: bike.data().isElectric,
        model: bike.data().model,
        photoURL: bike.data().photoURL,
        pricePerHour: bike.data().pricePerHour,
        rating: bike.data().rating,
        speeds: bike.data().speeds,
        type: bike.data().type,
        year: bike.data().year,
      });
    });

    return {
      props: {
        admin: userSnap.data() as EmployeeData,
        totalLocations,
        totalUsers,
        totalRevenue,
        futureReservations,
        todayReservationsJSON: JSON.stringify(todayReservations),
        totalBikes,
        activeBikes,
        newUsers,
        allBikes,
        newReservations,
      },
    };
  } catch (err) {
    console.log('ADMIN INDEX PAGE', err);
    return {
      redirect: {
        destination: '/',
      },
      props: {},
    };
  }
};

export default Admin;
