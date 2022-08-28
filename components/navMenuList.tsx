import Link from 'next/link';
import Router from 'next/router';
import { useAuth } from '../utils/useAuth';

const NavMenuList = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <li>
        <Link href="home">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="user">
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
