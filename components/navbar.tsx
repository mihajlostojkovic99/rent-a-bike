import Link from 'next/link';
import cx from 'classnames';
import { useAuth } from '../utils/useAuth';
import Avatar from './avatar';
import NavMenuList from './navMenuList';
import LogInPopup from './logInPopup';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/20/solid';

type NavbarProps = {
  className?: string;
  children?: JSX.Element | JSX.Element[];
};

const Navbar = ({ className }: NavbarProps) => {
  const { user, userData } = useAuth();

  // console.log(user);

  if (userData?.isAdmin) {
    return (
      <div className={cx('w-full', className)}>
        <div className="mx-auto flex max-w-7xl items-center justify-between py-5 px-2 lg:px-5">
          <Link href="/admin">
            <a className="cursor-pointer text-3xl font-bold text-accentBlue lg:text-4xl">
              GoBike<sup className="text-lg tracking-tighter">Admin Panel</sup>
            </a>
          </Link>
          <label
            htmlFor="my-drawer"
            className="btn btn-accent btn-circle lg:hidden"
          >
            Menu
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('w-full', className)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between py-5 px-2 lg:px-5">
        <Link href={user ? '/home' : '/'}>
          <a className="cursor-pointer text-3xl font-bold text-accentBlue lg:text-4xl">
            GoBike
          </a>
        </Link>

        {user ? (
          <>
            <Avatar
              htmlFor={window.innerWidth < 1024 ? 'my-drawer' : ''}
              className="dropdown-hover dropdown-end dropdown mr-5"
              rounded
              priority
            >
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box hidden w-52 bg-accent p-2 font-bold text-offWhite shadow-xl lg:block"
              >
                <NavMenuList />
              </ul>
            </Avatar>
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
                className="btn btn-ghost gap-2 text-base normal-case"
              >
                Log in
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
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
      </div>
    </div>
  );
};

export default Navbar;
