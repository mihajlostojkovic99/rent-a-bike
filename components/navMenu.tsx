import Link from 'next/link';
import { useAuth } from '../utils/useAuth';
import LogInPopup from './logInPopup';
import NavMenuList from './navMenuList';
import cx from 'classnames';
import Image from 'next/image';

const NavMenu = () => {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <>
          <label
            htmlFor="my-drawer"
            // className="avatar placeholder dropdown dropdown-end dropdown-hover mr-5 lg:hidden"
            className={cx(
              'avatar dropdown dropdown-end dropdown-hover mr-5 lg:hidden',
              {
                placeholder: !user.photoURL,
              },
            )}
            tabIndex={0}
          >
            <div className="mask mask-squircle w-14 bg-accentBlue">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName
                    ?.split(' ')
                    .map((str) => str.charAt(0))
                    .join()}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="bottom"
                />
              ) : (
                <div className="btn btn-accent text-2xl font-bold">
                  {user.displayName?.split(' ').map((str) => str.charAt(0))}
                </div>
              )}
            </div>
          </label>
          <div
            // className="avatar placeholder dropdown dropdown-end dropdown-hover mr-5 hidden lg:block"
            className={cx(
              'avatar dropdown dropdown-end dropdown-hover mr-5 hidden lg:block',
              {
                placeholder: !user.photoURL,
              },
            )}
            tabIndex={0}
          >
            <div className="mask mask-squircle w-14 bg-accentBlue">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName
                    ?.split(' ')
                    .map((str) => str.charAt(0))
                    .join()}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="bottom"
                />
              ) : (
                <div className="btn btn-accent text-2xl font-bold">
                  {user.displayName?.split(' ').map((str) => str.charAt(0))}
                </div>
              )}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-accent p-2 font-bold text-offWhite shadow-xl"
            >
              <NavMenuList />
            </ul>
          </div>
        </>
      ) : (
        <ul className="menu rounded-box menu-horizontal p-2">
          <li>
            <Link href="/">
              <a className="btn btn-ghost text-base normal-case text-accentBlue underline">
                Learn more
              </a>
            </Link>
          </li>
          <li>
            <label
              htmlFor="my-modal"
              className="btn btn-ghost text-base normal-case"
            >
              Log in
            </label>
          </li>
          <li>
            <Link href="/signup" passHref>
              <button className="btn btn-accent normal-case">Sign up</button>
            </Link>
          </li>
        </ul>
      )}
      <LogInPopup />
    </>
  );
};

export default NavMenu;
