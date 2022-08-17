import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../utils/firebase';
import { useAuth } from '../utils/useAuth';

type FormData = {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
};

type PasswordPopupProps = {
  children?: JSX.Element | JSX.Element[];
};

const PasswordPopup = ({ children }: PasswordPopupProps) => {
  const { changePassword, logout } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const [firebaseError, setFirebaseError] = useState<string | null>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    changePassword(data.oldPassword, data.newPassword)
      .then(() => {
        logout();
      })
      .catch((error) => {
        console.log(error.code);
        setFirebaseError(error.code);
      });
    // login(data.email, data.password)
    //   .then(() => {
    //     Router.push('home');
    //   })
    //   .catch((error) => {
    //     const errorCode: string = error.code;
    //     console.log(errorCode);
    //     setFirebaseError(errorCode); //auth/user-not-found || auth/wrong-password
    //   });
  };

  return (
    <>
      <input type="checkbox" id="password" className="modal-toggle" />
      <label
        htmlFor="password"
        className="modal modal-bottom backdrop-blur-sm sm:modal-middle"
      >
        <label
          htmlFor=""
          className="modal-box relative flex h-fit w-96 items-center justify-center bg-offWhite"
        >
          <label
            htmlFor="password"
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
                  <span className="label-text text-accentBlue">
                    Old password:
                  </span>
                </label>
                <input
                  {...register('oldPassword', {
                    required: 'Please write your old password',
                  })}
                  type="password"
                  placeholder="Old password"
                  className="input input-bordered input-accent w-full bg-offWhite"
                />
                {errors.oldPassword && (
                  <span className="label-text-alt text-red-600">
                    {errors.oldPassword.message}
                  </span>
                )}
                {firebaseError === 'auth/wrong-password' &&
                  !errors.newPassword && (
                    <span className="label-text-alt text-red-600">
                      Wrong password
                    </span>
                  )}

                <label className="label">
                  <span className="label-text text-accentBlue">
                    New password:
                  </span>
                </label>
                <input
                  {...register('newPassword', {
                    required: 'Please choose a new password.',
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/,
                      message:
                        'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.',
                    },
                  })}
                  type="password"
                  placeholder="New password"
                  className="input input-bordered input-accent w-full bg-offWhite"
                />
                {errors.newPassword && (
                  <span className="label-text-alt mt-1 text-red-600">
                    {errors.newPassword.message}
                  </span>
                )}

                <label className="label">
                  <span className="label-text text-accentBlue">
                    Repeat new password:
                  </span>
                </label>
                <input
                  {...register('newPassword2', {
                    required: true,
                    validate: (pass: string) => {
                      if (watch('newPassword') !== pass) {
                        return 'Passwords do not match';
                      }
                    },
                  })}
                  type="password"
                  placeholder="Repeat new password"
                  className="input input-bordered input-accent w-full bg-offWhite"
                />
                {errors.newPassword2 && (
                  <span className="label-text-alt text-red-600">
                    {errors.newPassword2.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-accent btn-wide my-4 h-16 text-xl normal-case"
              >
                Change password
              </button>
            </form>
          </div>
        </label>
      </label>
    </>
  );
};

export default PasswordPopup;
