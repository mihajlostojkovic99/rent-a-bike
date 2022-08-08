import Head from 'next/head';
import Navbar from './navbar';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>GoBike</title>
      </Head>
      <div className="relative z-20">
        <Navbar className="z-0" />
        <main className="">{children}</main>
      </div>
    </>
  );
};

export default Layout;
