import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { Bike, EmployeeData, Location } from '../../lib/dbTypes';
import cx from 'classnames';
import { useEffect, useRef, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../utils/useAuth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { updateProfile } from 'firebase/auth';

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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type AddEmployeeProps = {
  className?: string;
};

const AddEmployee = ({ className }: AddEmployeeProps) => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // console.log(data);
    setLoading(true);

    const createdAt: Date = new Date();
    createdAt.setHours(0, 0, 0, 0);

    const credentials = await signUp(data.email, data.password);
    if (!credentials) {
      setLoading(false);
      return;
    }
    const user = credentials.user;

    await updateProfile(user, {
      displayName: `${data.firstName} ${data.lastName}`,
    });

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName: `${data.firstName} ${data.lastName}`,
      createdAt: Timestamp.fromDate(createdAt),
      isAdmin: true,
      email: user.email,
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
        Add a new employee.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-control mb-16">
        {/*EMAIL INPUT*/}
        <label className="label">
          <span className="label-text text-accentBlue">Write the email:</span>
        </label>
        <input
          {...register('email', {
            required: 'Please provide an email',
          })}
          type="email"
          placeholder="Email"
          className="input input-bordered input-accent w-full bg-transparent"
        />
        {errors.email && (
          <span className="label-text-alt text-red-600">
            {errors.email.message}
          </span>
        )}

        {/*FIRST NAME INPUT*/}
        <label className="label">
          <span className="label-text text-accentBlue">First name:</span>
        </label>
        <input
          {...register('firstName', {
            required: 'First name is required',
          })}
          type="text"
          placeholder="First name"
          className="input input-bordered input-accent w-full bg-transparent"
        />
        {errors.firstName && (
          <span className="label-text-alt text-red-600">
            {errors.firstName.message}
          </span>
        )}

        {/*LAST NAME INPUT*/}
        <label className="label">
          <span className="label-text text-accentBlue">Last name:</span>
        </label>
        <input
          {...register('lastName', {
            required: 'Last name is required',
          })}
          type="text"
          placeholder="Last name"
          className="input input-bordered input-accent w-full bg-transparent"
        />
        {errors.lastName && (
          <span className="label-text-alt text-red-600">
            {errors.lastName.message}
          </span>
        )}

        {/*PASSWORD INPUT*/}
        <label className="label">
          <span className="label-text text-accentBlue">Password:</span>
        </label>
        <input
          {...register('password', {
            required: 'Please choose a password.',
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/,
              message:
                'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.',
            },
          })}
          type="password"
          placeholder="Password"
          className="input input-bordered input-accent w-full bg-transparent"
        />
        {errors.password && (
          <span className="label-text-alt text-red-600">
            {errors.password.message}
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

export default AddEmployee;
