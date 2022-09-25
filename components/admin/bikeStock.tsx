import Select from 'react-select';
import { Bike, Location } from '../../lib/dbTypes';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Interval, isWithinInterval } from 'date-fns';

export const selectStyles = {
  control: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
    ...styles,
    backgroundColor: 'transparent',
    height: '48px',
    width: '100%',
    // '@media (min-width: 1024px)': {
    //   width: '11rem',
    // },
    border: '1px solid #008CEE',
    borderRadius: '0.5rem',
  }),
  menu: (styles: any) => ({ ...styles, backgroundColor: '#E3E3E3' }),
  option: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
    ...styles,
    backgroundColor: isSelected
      ? '#008CEE'
      : isFocused && 'rgb(0 140 238 / 0.1)',
  }),
};

type BikeStockType = {
  locations: Location[];
  bikes: Bike[];
  className?: string;
};

const BikeStock = ({ locations, bikes, className }: BikeStockType) => {
  const [bikeId, setBikeId] = useState<string | undefined>(undefined);
  const [locationId, setLocationId] = useState<string | undefined>(undefined);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [oldTotal, setOldTotal] = useState<number>(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bikeId || !locationId) {
      setOldTotal(0);
      return;
    }

    const fetchTotal = async () => {
      console.log('fetching total...');
      const docSnap = await getDoc(doc(db, 'stock', `${bikeId}_${locationId}`));
      if (docSnap.exists()) {
        setOldTotal(docSnap.data().total);
      } else {
        setOldTotal(0);
      }
    };

    fetchTotal();
  }, [bikeId, locationId]);

  const clickHandler = async () => {
    if (!bikeId || !locationId || !total || !oldTotal || total < 0) return;
    setLoading(true);
    if (total < oldTotal) {
      const resSnap = await getDocs(
        collection(db, 'stock', `${bikeId}_${locationId}`, 'reservations'),
      );
      let overlap = 0;
      resSnap.forEach((res) => {
        const interval: Interval = {
          start: (res.data().startDate as Timestamp).seconds * 1000,
          end: (res.data().endDate as Timestamp).seconds * 1000,
        };
        if (isWithinInterval(new Date(), interval)) overlap++;
      });
      if (overlap > total) {
        console.log('OPERATION NOT PERMITTED, BIKES ARE RENTED OUT CURRENTLY');
        return;
      }
    }
    await setDoc(doc(db, 'stock', `${bikeId}_${locationId}`), {
      bikeId: bikeId,
      locationId: locationId,
      total: total,
    });
    setOldTotal(total);
    setLoading(false);
  };
  return (
    <div
      className={cx(
        'flex flex-col items-center rounded-md bg-accentBlue/20 p-3 shadow lg:rounded-3xl xl:p-6',
        className,
      )}
    >
      <div className="mb-4 text-3xl font-extrabold tracking-tighter">
        Change bike stock.
      </div>
      <div className="flex w-full flex-col gap-6">
        <Select
          options={bikes.map((bike) => {
            return {
              value: bike.id,
              label: `${bike.brand} ${bike.model} ${bike.year}`,
            };
          })}
          isSearchable={false}
          isClearable={true}
          placeholder="Model..."
          onChange={(val) => setBikeId(val?.value)}
          styles={selectStyles}
        />
        <Select
          options={locations.map((loc) => {
            return {
              value: loc.id,
              label: `${loc.place}, ${loc.city}`,
            };
          })}
          isSearchable={false}
          isClearable={true}
          placeholder="Location..."
          onChange={(val) => setLocationId(val?.value)}
          styles={selectStyles}
        />
        <div className="w-full">
          <input
            type="number"
            placeholder="Total number of bikes"
            className={cx(
              'input input-bordered input-accent w-full bg-transparent',
              { 'input-disabled': !bikeId || !locationId },
            )}
            disabled={!bikeId || !locationId ? true : false}
            onChange={(e) => setTotal(parseInt(e.target.value))}
          />
          {oldTotal !== undefined && (
            <div>Current number of bikes is: {oldTotal}</div>
          )}
        </div>
        <button
          className={cx('btn btn-accent w-full text-lg normal-case', {
            loading: loading,
          })}
          onClick={clickHandler}
        >
          Update stock
        </button>
      </div>
    </div>
  );
};

export default BikeStock;
