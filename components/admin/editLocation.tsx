import Select from 'react-select';
import { Location } from '../../lib/dbTypes';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useForm } from 'react-hook-form';

export const selectStyles = {
  control: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
    ...styles,
    backgroundColor: 'transparent',
    height: '48px',
    width: '100%',
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

type FormData = {
  city: string;
  place: string;
};

type EditLocationProps = {
  locations: Location[];
  className?: string;
};

const EditLocation = ({ locations, className }: EditLocationProps) => {
  const dropdownOptions = locations.map((loc) => {
    return {
      value: loc.id,
      label: `${loc.place}, ${loc.city}`,
    };
  });

  const [selectedLocation, setSelectedLocation] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    reset({
      city: locations.find((loc) => {
        if (loc.id === selectedLocation) return true;
        else return false;
      })?.city,
      place: locations.find((loc) => {
        if (loc.id === selectedLocation) return true;
        else return false;
      })?.place,
    });
  }, [locations, reset, selectedLocation]);

  const onSubmit = async (data: FormData) => {
    console.log(data);
    if (!selectedLocation) return;

    setLoading(true);

    await setDoc(
      doc(db, 'locations', selectedLocation),
      {
        city: data.city,
        place: data.place,
      },
      { merge: true },
    );

    setLoading(false);
  };

  return (
    <div
      className={cx(
        'w-full rounded-md bg-accentBlue/10 p-3 lg:rounded-3xl xl:p-6',
        className,
      )}
    >
      <div className="mb-4 text-center text-3xl font-extrabold tracking-tighter">
        Manage locations.
      </div>
      <Select
        options={dropdownOptions}
        placeholder="Choose a location"
        isSearchable={false}
        isClearable={true}
        styles={selectStyles}
        onChange={(val) => setSelectedLocation(val?.value)}
      />
      {selectedLocation && (
        <form onSubmit={handleSubmit(onSubmit)} className="form-control">
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
          <div className="btn-group mt-4 w-full">
            <button
              type="submit"
              className={cx('btn btn-accent w-1/2', {
                loading: loading,
              })}
            >
              Edit
            </button>
            <button
              type="button"
              data-theme="dangertheme"
              className={cx('btn btn-accent w-1/2', {
                loading: loading,
              })}
            >
              Remove
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditLocation;
