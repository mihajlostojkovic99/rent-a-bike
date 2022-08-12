import Link from 'next/link';
import cx from 'classnames';
import NavMenu from './navMenu';

type NavbarProps = {
  className?: string;
  children?: JSX.Element | JSX.Element[];
};

const Navbar = ({ className }: NavbarProps) => {
  return (
    <div className={cx('w-full', className)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between py-5 px-2 lg:px-5">
        <Link href="/">
          <a className="cursor-pointer text-3xl font-bold text-accentBlue lg:text-4xl">
            GoBike
          </a>
        </Link>
        <div>
          <NavMenu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
