import { bikePictures, db } from '../../utils/firebase';
import { addDoc, collection, setDoc } from 'firebase/firestore';
import { Controller, useForm } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { useState } from 'react';
import BikeCard from '../../components/bikeCard';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import cx from 'classnames';
import { bikeTypes } from '../../lib/bikeTypes';

export const selectStyles = {
  control: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
    ...styles,
    'backgroundColor': 'transparent',
    'height': '48px',
    'width': '100%',
    '@media (min-width: 1024px)': {
      width: '11rem',
    },
    'border': '1px solid #008CEE',
    'borderRadius': '0.5rem',
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
  type: { value: string; label: string };
  brand: string;
  model: string;
  year: number;
  speeds: number;
  brakes: string;
  isElectric: { value: boolean; label: string };
  pricePerHour: number;
  photoURL: File[];
};

type AddBikeType = {
  className?: string;
};

const AddBike = ({ className }: AddBikeType) => {
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<FormData>({
    defaultValues: {
      isElectric: { value: false, label: 'No' },
      type: { value: 'mtb', label: 'Mountain bike' },
      photoURL: [],
    },
  });

  const formData = watch();

  const [preview, setPreview] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    setUploading(true);
    const modelsRef = collection(db, 'bikes', data.type.value, 'models');
    const bikeRef = await addDoc(modelsRef, {
      brakes: data.brakes,
      brand: data.brand,
      isElectric: data.isElectric.value,
      model: data.model,
      photoURL: '',
      pricePerHour: data.pricePerHour,
      rating: 5.0,
      speeds: data.speeds,
      type: data.type.label,
      year: data.year,
    });

    const bikePicturesRef = ref(
      bikePictures,
      `${data.type.value}/${bikeRef.id}.png`,
    );

    const uploadTask = await uploadBytes(bikePicturesRef, data.photoURL[0]);

    const photoURL = await getDownloadURL(uploadTask.ref);

    await setDoc(
      bikeRef,
      {
        photoURL: photoURL,
        id: bikeRef.id,
      },
      { merge: true },
    );
    setUploading(false);
  };
  return (
    <div
      className={cx(
        'flex w-full flex-col items-center rounded-md bg-accentBlue/10 p-3 lg:rounded-3xl xl:p-6',
        className,
      )}
    >
      <div className="text-3xl font-extrabold tracking-tighter">
        Add a new model.
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4 flex w-full flex-col gap-3 lg:flex-row lg:flex-wrap"
      >
        {/*TYPE INPUT*/}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-accentBlue">Type</span>
          </label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={bikeTypes}
                placeholder="Bike type"
                isSearchable={false}
                styles={selectStyles}
              />
            )}
          />

          {errors.type && (
            <span className="label-text-alt text-red-600">
              {errors.type.message}
            </span>
          )}
        </div>

        {/*BRAND INPUT*/}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-accentBlue">Brand</span>
          </label>
          <input
            {...register('brand', {
              required: 'Brand is required',
            })}
            placeholder="Brand"
            className="input input-bordered input-accent w-full bg-transparent"
          />
          {errors.brand && (
            <span className="label-text-alt text-red-600">
              {errors.brand.message}
            </span>
          )}
        </div>

        {/*MODEL INPUT*/}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-accentBlue">Model</span>
          </label>
          <input
            {...register('model', {
              required: 'Model is required',
            })}
            placeholder="Model"
            className="input input-bordered input-accent w-full bg-transparent"
          />
          {errors.model && (
            <span className="label-text-alt text-red-600">
              {errors.model.message}
            </span>
          )}
        </div>

        {/*YEAR INPUT*/}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-accentBlue">Year</span>
          </label>
          <input
            {...register('year', {
              required: 'Year is required',
              valueAsNumber: true,
              min: { value: 2010, message: 'Minimum year is 2010' },
              max: {
                value: new Date().getFullYear(),
                message: 'Future years are not allowed',
              },
            })}
            type="number"
            placeholder="Year"
            className="input input-bordered input-accent w-full bg-transparent"
          />
          {errors.year && (
            <span className="label-text-alt text-red-600">
              {errors.year.message}
            </span>
          )}
        </div>

        {/*SPEEDS INPUT*/}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-accentBlue">Number of speeds</span>
          </label>
          <input
            {...register('speeds', {
              required: 'Number of speeds is required',
              valueAsNumber: true,
              min: {
                value: 1,
                message: 'Bike must have at least 1 speed',
              },
            })}
            type="number"
            placeholder="Speeds"
            className="input input-bordered input-accent w-full bg-transparent"
          />
          {errors.speeds && (
            <span className="label-text-alt text-red-600">
              {errors.speeds.message}
            </span>
          )}
        </div>

        {/*BRAKES INPUT*/}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-accentBlue">Type of brakes</span>
          </label>
          <input
            {...register('brakes', {
              required: 'Type of brakes is required',
            })}
            placeholder="Brakes"
            className="input input-bordered input-accent w-full bg-transparent"
          />
          {errors.brakes && (
            <span className="label-text-alt text-red-600">
              {errors.brakes.message}
            </span>
          )}
        </div>

        {/*ELECTRIC INPUT*/}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-accentBlue">Is it electric?</span>
          </label>
          <Controller
            name="isElectric"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: true, label: 'Yes' },
                  { value: false, label: 'No' },
                ]}
                isSearchable={false}
                styles={selectStyles}
              />
            )}
          />
          {errors.isElectric && (
            <span className="label-text-alt text-red-600">
              {errors.isElectric.message}
            </span>
          )}
        </div>

        {/*PRICE PER HOUR INPUT*/}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-accentBlue">Price per hour</span>
          </label>
          <input
            {...register('pricePerHour', {
              required: 'Price per hour is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Price cannot be negative' },
            })}
            type="number"
            placeholder="Price per hour"
            className="input input-bordered input-accent w-full bg-transparent"
          />
          {errors.pricePerHour && (
            <span className="label-text-alt text-red-600">
              {errors.pricePerHour.message}
            </span>
          )}
        </div>

        {/*BIKE IMAGE INPUT*/}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-accentBlue">Bike image (PNG)</span>
          </label>
          <label className="btn btn-outline btn-accent text-lg normal-case">
            Upload image
            <input
              {...register('photoURL', {
                required: 'Please upload bike image',
              })}
              type="file"
              className="hidden"
              accept="image/png"
            />
          </label>
          {errors.photoURL && (
            <span className="label-text-alt text-red-600">
              {errors.photoURL.message}
            </span>
          )}
        </div>

        {/*PREVIEW TOGGLE*/}
        <div>
          <label className="label">
            <span className="label-text text-accentBlue">Preview card</span>
          </label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="btn btn-outline btn-accent text-lg normal-case"
          >
            Preview
          </button>
        </div>

        {/*SUBMIT INPUT*/}
        <div className="grow">
          <label className="label">
            <span className="label-text text-accentBlue">Add the model</span>
          </label>
          <button
            className={cx('btn btn-accent w-full text-lg normal-case', {
              loading: uploading,
            })}
          >
            Submit
          </button>
        </div>
      </form>

      {preview && (
        <BikeCard
          bike={{
            type: formData.type.label,
            brand: formData.brand,
            model: formData.model,
            year: formData.year || new Date().getFullYear(),
            speeds: formData.speeds || 0,
            brakes: formData.brakes,
            isElectric: formData.isElectric.value,
            pricePerHour: formData.pricePerHour || 0,
            photoURL:
              formData.photoURL.length > 0
                ? URL.createObjectURL(formData.photoURL[0])
                : '',
            id: 'preview',
            rating: 5.0,
          }}
          onClick={() => {}}
        />
      )}
    </div>
  );
};

export default AddBike;
