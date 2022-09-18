import Head from 'next/head';
import { useAuth } from '../utils/useAuth';
import Footer from './footer';
import Navbar from './navbar';
import NavMenuList from './navMenuList';
import { BeatLoader } from 'react-spinners';

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { user, userData } = useAuth();
  console.log(children);

  if (userData?.isAdmin) {
    return (
      <>
        <Head>
          <title>GoBike Admin</title>
        </Head>
        <div className="drawer-mobile drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content relative z-20 overflow-x-hidden">
            <Navbar />
            <main>
              {children ?? (
                <div className="mt-40 text-center">
                  <BeatLoader color="#008CEE" />
                </div>
              )}
            </main>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              className="drawer-overlay backdrop-blur-sm"
            ></label>
            <ul className="menu w-80 overflow-y-auto bg-accent p-4 font-bold">
              <NavMenuList />
            </ul>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>GoBike</title>
      </Head>
      <div className="drawer drawer-end">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content relative z-20 flex min-h-screen flex-col overflow-x-hidden">
          <Navbar />
          <main className="grow">
            {children ?? (
              <div className="mt-40 text-center">
                <BeatLoader color="#008CEE" />
              </div>
            )}
          </main>
          {user !== undefined && <Footer />}
        </div>
        <div className="drawer-side lg:hidden">
          <label
            htmlFor="my-drawer"
            className="drawer-overlay backdrop-blur-sm lg:hidden"
          ></label>
          <ul className="menu w-80 overflow-y-auto bg-accent p-4 font-bold lg:hidden">
            <NavMenuList />
          </ul>
        </div>
      </div>
    </>
  );
};

export default Layout;
