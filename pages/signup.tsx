import type { NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import Layout from '../components/layout';
import { updateProfile } from 'firebase/auth';
import { Router, useRouter } from 'next/router';
import { useAuth } from '../utils/useAuth';
import { useForm } from 'react-hook-form';
import { db, profilePictures } from '../utils/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import cx from 'classnames';
import Avatar from '../components/avatar';

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  password2: string;
  profilePicture: File[];
};

const SignupPage: NextPage = () => {
  const router = useRouter();

  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const image = watch('profilePicture');
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    // console.log(data);
    setLoading(true);

    const createdAt: Date = new Date();
    createdAt.setHours(0, 0, 0, 0);
    console.log(createdAt);

    const credentials = await signUp(data.email, data.password);
    if (!credentials) {
      setLoading(false);
      return;
    }
    const user = credentials.user;

    var photoURL: string | null = null;

    if (data.profilePicture && data.profilePicture.length > 0) {
      const photoRef = ref(
        profilePictures,
        `${user.uid}.${
          // data.profilePicture[0].type === 'image/png' ? 'png' : 'jpg'
          data.profilePicture[0].type.split('/')[1]
        }`,
      );
      const uploadTask = await uploadBytes(photoRef, data.profilePicture[0]);
      photoURL = await getDownloadURL(uploadTask.ref);
    }

    await updateProfile(user, {
      displayName: `${data.firstName} ${data.lastName}`,
      photoURL: photoURL,
    });

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName: `${data.firstName} ${data.lastName}`,
      photoURL: photoURL,
      createdAt: Timestamp.fromDate(createdAt),
      balance: 0,
      reviews: 0,
      rides: 0,
    });

    setLoading(false);
    router.push('home');
  };

  return (
    <>
      <Layout>
        <div className="mt-2 w-full lg:mt-5">
          <div className="mx-auto flex flex-col items-center text-center text-2xl font-extrabold tracking-tight text-white lg:text-4xl">
            Create your GoBike account.
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mt-5 flex max-w-xl flex-col items-center rounded-md bg-offWhite px-4 text-justBlack"
        >
          <div className="form-control mt-4 w-full">
            <label className="label">
              <span className="label-text text-accentBlue">
                Write your email:
              </span>
            </label>
            <input
              {...register('email', {
                required: 'Please provide an email',
              })}
              type="email"
              placeholder="Email"
              className="input input-bordered input-accent w-full bg-offWhite"
            />
            {errors.email && (
              <span className="label-text-alt text-red-600">
                {errors.email.message}
              </span>
            )}

            <label className="label">
              <span className="label-text text-accentBlue">
                What is your name?
              </span>
            </label>
            <input
              {...register('firstName', {
                required: 'First name is required',
              })}
              type="text"
              placeholder="First name"
              className="input input-bordered input-accent w-full bg-offWhite"
            />
            {errors.firstName && (
              <span className="label-text-alt text-red-600">
                {errors.firstName.message}
              </span>
            )}

            <label className="label">
              <span className="label-text text-accentBlue">
                And your last name?
              </span>
            </label>
            <input
              {...register('lastName', {
                required: 'Last name is required',
              })}
              type="text"
              placeholder="Last name"
              className="input input-bordered input-accent w-full bg-offWhite"
            />
            {errors.lastName && (
              <span className="label-text-alt text-red-600">
                {errors.lastName.message}
              </span>
            )}

            <label className="label">
              <span className="label-text text-accentBlue">
                Please choose the password wisely:
              </span>
            </label>
            <input
              {...register('password', {
                required: 'Please choose a password.',
                pattern: {
                  value:
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/,
                  message:
                    'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.',
                },
              })}
              type="password"
              placeholder="Password"
              className="input input-bordered input-accent w-full bg-offWhite"
            />
            {errors.password && (
              <span className="label-text-alt text-red-600">
                {errors.password.message}
              </span>
            )}

            <label className="label">
              <span className="label-text text-accentBlue">
                Repeat the password just to make sure:
              </span>
            </label>
            <input
              {...register('password2', {
                required: true,
                validate: (pass: string) => {
                  if (watch('password') !== pass) {
                    return 'Passwords do not match';
                  }
                },
              })}
              type="password"
              placeholder="Confirm password"
              className="input input-bordered input-accent w-full bg-offWhite"
            />
            {errors.password2 && (
              <span className="label-text-alt text-red-600">
                {errors.password2.message}
              </span>
            )}

            <label className="label">
              <span className="label-text text-accentBlue">
                Upload a profile image if you want (you can do it later as
                well):
              </span>
            </label>
            <label className="btn btn-outline btn-accent w-full text-lg normal-case">
              Upload profile image
              <input
                {...register('profilePicture')}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg"
              />
            </label>
          </div>

          <Avatar
            className=" mt-3"
            classNameSize="w-36"
            imageSrc={
              image && image.length > 0 ? URL.createObjectURL(image[0]) : null
            }
          />

          <button
            type="submit"
            className={cx('btn btn-accent my-4 h-16 text-xl normal-case', {
              loading: loading,
            })}
          >
            Create an account
          </button>
        </form>
      </Layout>
    </>
  );
};

export default SignupPage;
