import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import Image from 'next/image';
import { StarIcon, LightningBoltIcon } from '@heroicons/react/solid';
import React, {
  Dispatch,
  forwardRef,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { db } from '../utils/firebase';
import cx from 'classnames';
import { SearchSort } from './searchbox';
import { Bike } from '../lib/dbTypes';
import BikeCard from './bikeCard';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/useAuth';

type SearchResultsProps = {
  bikeType?: string;
  location?: string;
  sort?: SearchSort;
  startTime?: Date | null;
  endTime?: Date | null;
};

const SearchResults = ({
  bikeType,
  location,
  sort = 'ascending',
  startTime,
  endTime,
}: SearchResultsProps) => {
  const { user } = useAuth();
  const router = useRouter();

  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // console.log(bikes);

  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      const q = query(
        bikeType
          ? collection(db, 'bikes', bikeType, 'models')
          : collectionGroup(db, 'models'),
        sort === 'popularity'
          ? orderBy('rating', 'desc')
          : orderBy('pricePerHour', sort === 'descending' ? 'desc' : 'asc'),
      );

      const bikesSnap = await getDocs(q);
      const bikesArr: Bike[] = [];

      bikesSnap.forEach((bikeSnap) => {
        bikesArr.push({
          id: bikeSnap.data().id,
          brand: bikeSnap.data().brand,
          model: bikeSnap.data().model,
          pricePerHour: bikeSnap.data().pricePerHour,
          year: bikeSnap.data().year,
          type: bikeSnap.data().type,
          speeds: bikeSnap.data().speeds,
          brakes: bikeSnap.data().brakes,
          photoURL: bikeSnap.data().photoURL,
          isElectric: bikeSnap.data().isElectric,
          rating: bikeSnap.data().rating,
        });
      });

      if (location) {
        const bikesAtLocation: Bike[] = [];

        for (const bike of bikesArr) {
          const checkLocationQuery = query(
            collection(db, 'stock'),
            where('bikeId', '==', bike.id),
            where('locationId', '==', location),
            limit(1),
          );
          const stockSnap = await getDocs(checkLocationQuery);

          if (!stockSnap.empty) {
            bikesAtLocation.push(bike);
          }
        }
        setBikes(bikesAtLocation);
      } else {
        setBikes(bikesArr);
      }

      setLoading(false);
    }

    fetchData();
  }, [bikeType, location, sort]);

  return (
    <div className="mx-auto mt-8 flex max-w-7xl flex-wrap gap-8 rounded-lg bg-offWhite p-4 text-base text-black lg:rounded-3xl lg:p-8">
      {loading ? (
        <>Loading...</>
      ) : (
        bikes.map((bike) => {
          return (
            <BikeCard
              key={bike.id}
              bike={bike}
              onClick={() => {
                if (!user) return;
                if (location) {
                  router.push({
                    pathname: `/bikes/${bike.id}`,
                    query: {
                      locationId: location,
                      startTime: startTime?.getTime(),
                      endTime: endTime?.getTime(),
                    },
                  });
                } else {
                  router.push(`/bikes/${bike.id}`);
                }
              }}
            />
          );
        })
      )}
    </div>
  );
};

export default SearchResults;
