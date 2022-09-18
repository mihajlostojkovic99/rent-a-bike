import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import { useAuth } from '../utils/useAuth';
import { HomeIcon, FlagIcon } from '@heroicons/react/24/solid';
import {
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/20/solid';

const NavMenuList = () => {
  const { userData, logout } = useAuth();

  if (userData?.isAdmin) {
    return (
      <>
        <li className="menu-title">
          <span>Navigation</span>
        </li>
        <li>
          <Link href="/admin">
            <a>
              <HomeIcon className="h-5 w-5" />
              Home
            </a>
          </Link>
        </li>
        <li>
          <a
            onClick={() => {
              logout();
            }}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Log out
          </a>
        </li>
        <li className="menu-title">
          <span>Manage</span>
        </li>
        <li>
          <Link href="/admin/bikes">
            <a>Bikes</a>
          </Link>
        </li>
        {/* <li>
          <Link href="">
            <a>Inventory</a>
          </Link>
        </li> */}
        <li>
          <Link href="/admin/locations">
            <a>Locations</a>
          </Link>
        </li>
        <li>
          <Link href="/admin/employees">
            <a>Employees</a>
          </Link>
        </li>
        <li className="menu-title">
          <span>Clients</span>
        </li>
        <li>
          <Link href="/admin/reports">
            <a>
              <FlagIcon className="h-5 w-5" />
              Reported reviews
            </a>
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li>
        <Link href="/home">
          <a>
            <HomeIcon className="h-5 w-5" />
            Home
          </a>
        </Link>
      </li>
      <li>
        <Link href={`/users/${userData?.uid}`}>
          <a>
            <UserIcon className="h-5 w-5" />
            View Profile
          </a>
        </Link>
      </li>
      <li>
        <Link href="/user">
          <a>
            <Cog6ToothIcon className="h-5 w-5" />
            Settings
          </a>
        </Link>
      </li>
      <li>
        <a
          onClick={() => {
            logout().then(() => Router.push('/'));
          }}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Log out
        </a>
      </li>
    </>
  );
};

export default NavMenuList;
