import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { Bike, Location } from '../../lib/dbTypes';
import cx from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useForm } from 'react-hook-form';

type FormData = {
  city: string;
  place: string;
};

type AddLocationProps = {
  locations: Location[];
  className?: string;
};

const AddLocation = ({ locations, className }: AddLocationProps) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log(data);

    setLoading(true);

    await addDoc(collection(db, 'locations'), {
      city: data.city,
      place: data.place,
    });

    setLoading(false);
  };

  return (
    <div
      className={cx(
        'w-full rounded-md bg-accentBlue/10 p-3 lg:rounded-3xl xl:p-6',
        className,
      )}
    >
      <div className=" text-center text-3xl font-extrabold tracking-tighter">
        Add location.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-control mb-16">
        {/*CITY INPUT*/}
        <label className="label">
          <span className="label-text text-accentBlue">City:</span>
        </label>
        <input
          {...register('city', {
            required: 'Please choose a city',
          })}
          placeholder="City"
          className="input input-bordered input-accent w-full bg-transparent"
        />
        {errors.city && (
          <span className="label-text-alt text-red-600">
            {errors.city.message}
          </span>
        )}

        {/*PLACE INPUT*/}
        <label className="label">
          <span className="label-text text-accentBlue">Place:</span>
        </label>
        <input
          {...register('place', {
            required: 'Please provide the precise location',
          })}
          placeholder="Place"
          className="input input-bordered input-accent w-full bg-transparent"
        />
        {errors.place && (
          <span className="label-text-alt text-red-600">
            {errors.place.message}
          </span>
        )}
        <button
          type="submit"
          className={cx('btn btn-accent mt-4 w-full', {
            loading: loading,
          })}
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default AddLocation;
