import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/layout';
import Searchbox from '../components/searchbox';
import bike from '../public/bg_bike.jpg';
import { useAuth } from '../utils/useAuth';
import Router from 'next/router';
import nookies from 'nookies';
import { verifyIdToken } from '../utils/firebaseAdmin';
import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { db, userToJSON } from '../utils/firebase';

type IndexProps = {
  userData?: DocumentData;
};

const Index: NextPage<IndexProps> = ({ userData }: IndexProps) => {
  const { user } = useAuth();
  console.log('INDEX PAGE RENDERED AND USER IS: ', user);
  if (user) {
    Router.push('home');
  }
  return (
    <>
      <Layout>
        {user === null && (
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
                  // priority
                ></Image>
                <div className="absolute bottom-0 h-24 w-full bg-gradient-to-t from-darkBlue lg:h-60"></div>
                <div className="imgGradientTopToBottom absolute top-40 h-56 w-full"></div>
              </div>
            </div>

            <div className="mt-20 w-full lg:mt-60">
              <div className="mx-auto flex w-fit flex-col items-center text-center text-5xl font-extrabold tracking-tight text-white lg:text-7xl">
                <div>Book your next ride with us.</div>
                {/* <Button className="mt-20 h-24 w-72 text-5xl outline outline-2 outline-white/40">
                Join now
              </Button> */}
                <Link href="/signup" passHref>
                  <button className="btn btn-accent outline mt-12 h-16 w-48 text-3xl normal-case outline-2 outline-white/40 lg:mt-20 lg:h-24 lg:w-72 lg:text-5xl">
                    Join now
                  </button>
                </Link>
              </div>
            </div>
            <Searchbox className="mx-1 mt-32 lg:mx-auto lg:mt-48 "></Searchbox>
            <div className="mt-8 h-96 w-full"></div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Index;
