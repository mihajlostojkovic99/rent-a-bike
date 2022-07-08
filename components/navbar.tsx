import { Popover, Transition } from '@headlessui/react';
import cx from 'classnames';
import { useState } from 'react';

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-32 py-5">
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between rounded-2xl border bg-offWhite2 px-4 shadow-md">
        <span className="font-['Inter'] text-3xl font-extrabold uppercase tracking-wide text-accentBlue">
          Bike Rent
        </span>
        <div className="grow px-28">
          <div className="flex">
            <Popover>
              {({ open }) => (
                <>
                  <Popover.Button
                    className={cx('mx-4', { 'text-red-600': open })} //TODO: SREDI DA OSTANE PODVUCENO SA PSEUDO ELEMENTOM KAD GA NAPRAVIS
                  >
                    Bikes
                  </Popover.Button>
                  <Transition show={open}>
                    <Popover.Panel className="absolute top-full left-0 mt-3 ml-2 w-[60rem] rounded-2xl border bg-offWhite2 px-4 shadow-md">
                      <div>
                        <ul>
                          <li>ABC</li>
                          <li>TRALALA</li>
                          <li>Bla</li>
                        </ul>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            <Popover>
              <Popover.Button className="mx-4">Locations</Popover.Button>
              <Popover.Panel className="absolute top-full left-0 mt-3 ml-2 w-[60rem] rounded-2xl border bg-offWhite2 px-4 shadow-md">
                <div>
                  <ul>
                    <li>Beograd</li>
                    <li>Novi Sad</li>
                    <li>Nis</li>
                  </ul>
                </div>
              </Popover.Panel>
            </Popover>
          </div>
        </div>

        <div className="text-md uppercase">
          <span>Log In</span> |{' '}
          <span className="text-lg font-bold">Sign Up</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
