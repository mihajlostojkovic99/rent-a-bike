import Link from 'next/link';
import { useAuth } from '../utils/useAuth';
import LogInPopup from './logInPopup';
import NavMenuList from './navMenuList';
import cx from 'classnames';
import Image from 'next/image';
import Avatar from './avatar';

const NavMenu = () => {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <>
          <Avatar
            htmlFor={window.innerWidth < 1024 ? 'my-drawer' : ''}
            className="dropdown-end dropdown-hover dropdown mr-5"
          >
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box hidden w-52 bg-accent p-2 font-bold text-offWhite shadow-xl lg:block"
            >
              <NavMenuList />
            </ul>
          </Avatar>
          {/* <label
            htmlFor={window.innerWidth < 1024 ? 'my-drawer' : ''}
            className={cx(
              'dropdown-end dropdown-hover avatar dropdown mr-5 lg:block',
              {
                placeholder: !user.photoURL,
              },
            )}
            tabIndex={0}
          >
            <div className="mask mask-squircle w-14 bg-accentBlue ring ring-accent">
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
              className="dropdown-content menu rounded-box hidden w-52 bg-accent p-2 font-bold text-offWhite shadow-xl lg:block"
            >
              <NavMenuList />
            </ul>
          </label> */}
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
