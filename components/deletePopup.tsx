import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import Link from 'next/link';
import Router from 'next/router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../utils/firebase';
import { useAuth } from '../utils/useAuth';

type DeletePopupProps = {
  children?: JSX.Element | JSX.Element[];
};

const DeletePopup = ({ children }: DeletePopupProps) => {
  const { deleteAccount } = useAuth();

  const password = useRef<string>('');

  const [firebaseError, setFirebaseError] = useState<string | null>();

  return (
    <>
      <input type="checkbox" id="delete" className="modal-toggle" />
      <label
        htmlFor="delete"
        className="modal modal-bottom backdrop-blur-sm sm:modal-middle"
      >
        <label
          htmlFor=""
          className="modal-box relative flex h-fit w-96 items-center justify-center bg-offWhite"
        >
          <label
            htmlFor="delete"
            className="btn btn-circle btn-sm absolute right-2 top-2"
          >
            ✕
          </label>
          <div className="form-control w-full">
            <div className="text-center text-3xl font-bold">Are you sure?</div>
            <label className="label">
              <span className="label-text text-accentBlue">
                Confirm by entering your password:
              </span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered input-accent w-full bg-offWhite"
              onChange={(e) => (password.current = e.target.value)}
            />
            {firebaseError === 'auth/wrong-password' && (
              <span className="label-text-alt text-red-600">
                Wrong password
              </span>
            )}
            {firebaseError === 'auth/internal-error' && (
              <span className="label-text-alt text-red-600">
                Please write your password
              </span>
            )}
            <button
              className="btn btn-accent my-4 h-16 w-full text-xl"
              onClick={() => {
                deleteAccount(password.current).catch((error) =>
                  setFirebaseError(error.code),
                );
              }}
            >
              Delete account
            </button>
          </div>
        </label>
      </label>
    </>
  );
};

export default DeletePopup;
