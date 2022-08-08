import Link from 'next/link';
import cx from 'classnames';

type NavbarProps = {
  className?: string;
};

const Navbar = ({ className }: NavbarProps) => {
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
          <Link href="/#" passHref>
            <button className="btn btn-ghost text-base normal-case">
              Log in
            </button>
          </Link>
          <Link href="/register" passHref>
            <button className="btn btn-accent normal-case">Sign up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
