import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../utils/firebase';
import { useAuth } from '../utils/useAuth';

type FormData = {
  email: string;
  password: string;
};

type LogInPopupProps = {
  children?: JSX.Element | JSX.Element[];
};

const LogInPopup = ({ children }: LogInPopupProps) => {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [firebaseError, setFirebaseError] = useState<string | null>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    login(data.email, data.password)
      .then(() => {
        Router.push('home');
      })
      .catch((error) => {
        const errorCode: string = error.code;
        console.log(errorCode);
        setFirebaseError(errorCode); //auth/user-not-found || auth/wrong-password
      });
  };

  const signInGoogle = () => {
    signInWithRedirect(auth, new GoogleAuthProvider()).then(() => {
      Router.push('home');
    });
  };

  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <label
        htmlFor="my-modal"
        className="modal modal-bottom backdrop-blur-sm sm:modal-middle"
      >
        <label
          htmlFor=""
          className="modal-box relative flex h-fit w-96 items-center justify-center bg-offWhite"
        >
          <label
            htmlFor="my-modal"
            className="btn btn-circle btn-sm absolute right-2 top-2"
          >
            ✕
          </label>
          <div className="flex w-full flex-col items-center">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col items-center text-justBlack"
            >
              <div className="form-control mt-4 w-full">
                <label className="label">
                  <span className="label-text text-accentBlue">Email:</span>
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
                {firebaseError === 'auth/user-not-found' && (
                  <span className="label-text-alt text-red-600">
                    User not found. You can create an account{' '}
                    <Link href="/signup">
                      <a className="link link-accent">here</a>
                    </Link>
                    .
                  </span>
                )}

                <label className="label">
                  <span className="label-text text-accentBlue">Password:</span>
                </label>
                <input
                  {...register('password', {
                    required: 'Wrong password',
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
                {firebaseError === 'auth/wrong-password' &&
                  !errors.password && (
                    <span className="label-text-alt text-red-600">
                      Wrond password
                    </span>
                  )}
              </div>

              <button
                type="submit"
                className="btn btn-accent btn-wide my-4 h-16 text-xl normal-case"
              >
                Log in
              </button>
            </form>
            <button
              className="btn btn-outline normal-case"
              onClick={signInGoogle}
            >
              Sign in with Google
            </button>
          </div>
        </label>
      </label>
    </>
  );
};

export default LogInPopup;
