import Head from 'next/head';
import Navbar from './navbar';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Bike Rent</title>
      </Head>
      <div>
        <Navbar />
        <main className="pt-40">{children}</main>
      </div>
    </>
  );
};

export default Layout;
