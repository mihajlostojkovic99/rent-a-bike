import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import Image from 'next/image';
import { StarIcon, LightningBoltIcon } from '@heroicons/react/solid';
import React, { forwardRef, RefObject, useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import cx from 'classnames';
import { SearchSort } from './searchbox';

type SearchResultsProps = {
  bikeType?: string;
  sort?: SearchSort;
};

type Bike = {
  id: string;
  brand: string;
  model: string;
  pricePerHour: number;
  year: number;
  type: string;
  speeds: number;
  brakes: string;
  photoURL: string;
  isElectric: boolean;
  rating: number;
};

const bikeTypeMap = new Map<string, string>();
bikeTypeMap.set('mtb', 'Mountain bike');
bikeTypeMap.set('city', 'City');
bikeTypeMap.set('road', 'Road');
bikeTypeMap.set('xc', 'Cross country');

const SearchResults = ({ bikeType, sort }: SearchResultsProps) => {
  console.log(sort);

  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  console.log(bikes);

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
          id: bikeSnap.id,
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

      setBikes(bikesArr);

      setLoading(false);
    }

    fetchData();
  }, [bikeType, sort]);

  return (
    <div className="mx-auto mt-8 flex max-w-7xl flex-wrap gap-8 rounded-lg bg-offWhite p-8 text-base text-black lg:rounded-3xl">
      {loading ? (
        <>Loading...</>
      ) : (
        bikes.map((bike) => {
          return (
            <div
              key={bike.id}
              className={cx(
                'card-compact card w-96  tracking-tighter shadow-xl',
                {
                  'bg-electricGreen/20': bike.isElectric,
                  'bg-accentBlue/20': !bike.isElectric,
                },
              )}
            >
              <div className="absolute m-2 flex items-center">
                <StarIcon className="h-6 w-6 stroke-black text-gold" />
                <div>{bike.rating.toFixed(1)}</div>
              </div>
              {bike.isElectric && (
                <div className="absolute right-0 m-2 stroke-black text-electricGreen">
                  <LightningBoltIcon className="h-6 w-6" />
                </div>
              )}
              <figure className="relative h-56 w-full">
                <Image
                  src={bike.photoURL}
                  alt="Image loading..."
                  layout="fill"
                  objectFit="contain"
                  objectPosition="bottom"
                ></Image>
              </figure>

              <div className="card-body">
                <h2 className="card-title mx-auto text-2xl font-extrabold">
                  {bike.brand} {bike.model}{' '}
                  <span className="text-justBlack/40">{bike.year}</span>
                </h2>
                <div className="mx-auto text-base">
                  <span className="font-bold">Type: </span>
                  {bike.type} | <span className="font-bold">Speeds: </span>{' '}
                  {bike.speeds} | <span className="font-bold">Brakes: </span>
                  {bike.brakes}
                </div>
                <div className="card-actions mt-3 justify-center gap-0">
                  <div>
                    Price: ${bike.pricePerHour}{' '}
                    <span className="text-justBlack/40">/ hour</span>
                  </div>
                  <button
                    data-theme={bike.isElectric ? 'greentheme' : 'mytheme'}
                    className="btn btn-accent w-full text-2xl normal-case tracking-tighter"
                  >
                    Find out more
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SearchResults;
