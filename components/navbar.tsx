import Link from 'next/link';
import cx from 'classnames';
import NavMenu from './navMenu';
import { useAuth } from '../utils/useAuth';

type NavbarProps = {
  className?: string;
  children?: JSX.Element | JSX.Element[];
};

const Navbar = ({ className }: NavbarProps) => {
  const { user } = useAuth();
  return (
    <div className={cx('w-full', className)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between py-5 px-2 lg:px-5">
        <Link href={user ? 'home' : '/'}>
          <a className="cursor-pointer text-3xl font-bold text-accentBlue lg:text-4xl">
            GoBike
          </a>
        </Link>
        <div>{user !== undefined && <NavMenu />}</div>
      </div>
    </div>
  );
};

export default Navbar;
