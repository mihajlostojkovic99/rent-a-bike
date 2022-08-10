import Link from 'next/link';
import cx from 'classnames';
import { useAuth } from '../utils/useAuth';
import firebase from 'firebase/compat/app';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../utils/firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

type NavbarProps = {
  className?: string;
};

const Navbar = ({ className }: NavbarProps) => {
  const { user } = useAuth();
  // console.log(user);

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      EmailAuthProvider.PROVIDER_ID,
      GoogleAuthProvider.PROVIDER_ID,
    ],
  };

  return (
    <div className={cx('w-full', className)}>
      <div className="mx-auto flex max-w-[1300px] items-center justify-between py-5 px-2 lg:px-5">
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
          {/* <a href="#" className="link link-accent lg:mx-3">
            Learn more
          </a> */}
          <label
            htmlFor="my-modal-4"
            className="btn btn-ghost text-base normal-case"
          >
            Log in
          </label>
          <Link href="/signup" passHref>
            <button className="btn btn-accent normal-case">Sign up</button>
          </Link>
        </div>
      </div>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      {/* <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box h-80" htmlFor="">
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </label>
      </label> */}
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative flex h-fit w-96 items-center justify-center">
          <label
            htmlFor="my-modal-4"
            className="btn btn-circle btn-sm absolute right-2 top-2"
          >
            ✕
          </label>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
