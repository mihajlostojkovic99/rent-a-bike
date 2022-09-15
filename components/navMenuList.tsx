import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import { useAuth } from '../utils/useAuth';

const NavMenuList = () => {
  const { userData, logout } = useAuth();

  if (userData?.isAdmin) {
    return (
      <>
        <li>
          <Link href="/admin">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <a
            onClick={() => {
              logout();
            }}
          >
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
        <li>
          <Link href="">
            <a>Inventory</a>
          </Link>
        </li>
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
            <a>Reported reviews</a>
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li>
        <Link href="/home">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/user">
          <a>My profile</a>
        </Link>
      </li>
      <li>
        <a
          onClick={() => {
            logout().then(() => Router.push('/'));
          }}
        >
          Log out
        </a>
      </li>
    </>
  );
};

export default NavMenuList;
