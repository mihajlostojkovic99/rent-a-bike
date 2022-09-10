import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/layout';
import Searchbox from '../components/searchbox';
import bike from '../public/bg_bike.jpg';
import { useAuth } from '../utils/useAuth';
import Router from 'next/router';

const Index: NextPage = () => {
  const { user, userData } = useAuth();

  console.log('RENDERED INDEX PAGE, user: ', user, ', userData: ', userData);

  if (userData?.isAdmin) {
    Router.push('admin');
    return <Layout></Layout>;
  }

  if (userData) {
    Router.push('home');
    return <Layout></Layout>;
  } else
    return (
      <Layout>
        <div>
          <div className="absolute -top-40 -z-10 w-full overflow-hidden">
            <div className="relative h-[650px] w-full lg:h-[1050px]">
              <Image
                src={bike}
                alt="BIKE IMAGE"
                layout="fill"
                objectFit="cover"
                objectPosition="bottom"
                placeholder="blur"
              ></Image>
              <div className="absolute bottom-0 h-24 w-full bg-gradient-to-t from-darkBlue lg:h-60"></div>
              <div className="imgGradientTopToBottom absolute top-40 h-56 w-full"></div>
            </div>
          </div>

          <div className="mt-20 w-full lg:mt-60">
            <div className="mx-auto flex w-fit flex-col items-center text-center text-5xl font-extrabold tracking-tight text-white lg:text-7xl">
              <div>Book your next ride with us.</div>
              <Link href="/signup" passHref>
                <button className="btn btn-accent outline mt-12 h-16 w-48 text-3xl normal-case outline-2 outline-white/40 lg:mt-20 lg:h-24 lg:w-72 lg:text-5xl">
                  Join now
                </button>
              </Link>
            </div>
          </div>
          <Searchbox className="mx-1 mt-32 lg:mx-auto lg:mt-48 "></Searchbox>
          {/* <div className="mt-8 h-96 w-full"></div> */}
          <div className="mx-auto mt-8 flex max-w-7xl flex-col items-start">
            <div className="max-w-xl">
              <h1 className="text-4xl font-extrabold">How it works</h1>
              <div className="mt-4">
                First, you choose where and how long you want to rent and then
                choose a bike that suits your needs from our diverse stock.
                After that, you can additionally choose some add-ons such as a
                helmet and/or a child seat and reserve it by paying in advance.
                After the rent period ends, on your next login, you will be
                asked to leave a review and a rating for that bike if it was
                your first time renting it. And that is it. Happy renting! 😀
              </div>
            </div>
            <div className="my-4 max-w-xl self-end">
              <h1 className="text-4xl font-extrabold">Pricing</h1>
              <div className="mt-4">
                The price is calculated on per hour basis if the rent duration
                is under a day. For periods over a day, the daily price is
                calculated as if renting the bike for 7 hours per day and the
                remainder is calculated on a per hour basis.
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
};

export default Index;
