import Router from 'next/router';
import { useAuth } from '../utils/useAuth';

const NavMenuList = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <li>
        <a>My profile</a>
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
