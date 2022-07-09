import { Combobox } from '@headlessui/react';
import Button from './button';
import cx from 'classnames';

type NavbarProps = {
  className?: string;
};

const Navbar = ({ className }: NavbarProps) => {
  return (
    <div className={cx('navGradient h-80 w-full', className)}>
      <div className="mx-auto flex max-w-[1300px] items-center justify-between py-5 px-5">
        <div className="text-4xl font-bold text-accentBlue">GoBike</div>
        <div className="flex items-center justify-between font-semibold">
          <a href="#" className="mx-3 text-accentBlue underline">
            Learn more
          </a>
          <a href="#" className="mx-3 text-offWhite">
            Log in
          </a>
          <Button>Sign up</Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
