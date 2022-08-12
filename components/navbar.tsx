import Link from 'next/link';
import cx from 'classnames';
import { useAuth } from '../utils/useAuth';
import firebase from 'firebase/compat/app';
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithRedirect,
} from 'firebase/auth';
import { auth } from '../utils/firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Router from 'next/router';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

type NavbarProps = {
  className?: string;
};

type FormData = {
  email: string;
  password: string;
};

const Navbar = ({ className }: NavbarProps) => {
  const { user, logout, login } = useAuth();

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
    <div className={cx('w-full', className)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between py-5 px-2 lg:px-5">
        <Link href="/">
          <a className="cursor-pointer text-2xl font-bold text-accentBlue lg:text-4xl">
            GoBike
          </a>
        </Link>
        <div className="flex items-center justify-between font-semibold">
          <Link href="/#" passHref>
            <button className="btn btn-ghost text-base normal-case text-accentBlue underline">
              Learn more
            </button>
          </Link>
          {user ? (
            <button
              className="btn btn-ghost text-base normal-case"
              onClick={() => {
                logout().then(() => Router.push('/'));
              }}
            >
              Log out
            </button>
          ) : (
            <label
              htmlFor="my-modal-4"
              className="btn btn-ghost text-base normal-case"
            >
              Log in
            </label>
          )}
          <Link href="/signup" passHref>
            <button className="btn btn-accent normal-case">Sign up</button>
          </Link>
        </div>
      </div>
      {/* {(user === null || user === undefined) ?? ( */}
      <div
        className={cx({
          hidden: user,
        })}
      >
        <input type="checkbox" id="my-modal-4" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box relative flex h-fit w-96 items-center justify-center bg-offWhite">
            <label
              htmlFor="my-modal-4"
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
                    <span className="label-text text-accentBlue">
                      Password:
                    </span>
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
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default Navbar;
