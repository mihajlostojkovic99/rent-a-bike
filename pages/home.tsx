import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import Layout from '../components/layout';
import Searchbox from '../components/searchbox';
import bike from '../public/home_bike.jpg';
import { verifyIdToken } from '../utils/firebaseAdmin';
import { doc, getDoc } from 'firebase/firestore';
import { db, userToJSON } from '../utils/firebase';
import nookies from 'nookies';
import { UserData } from '../utils/dbTypes';

type HomeProps = {
  userData: UserData;
};

const Home: NextPage<HomeProps> = ({ userData }: HomeProps) => {
  console.log('Home rendered');

  return (
    <Layout>
      <div className="absolute -z-10 mt-10 h-[650px] w-full lg:-right-40 lg:mt-0 lg:h-[450px] lg:w-[750px] lg:overflow-hidden lg:rounded-3xl lg:border-4">
        <Image
          src={bike}
          alt="BIKE IMAGE"
          layout="fill"
          objectFit="cover"
          objectPosition="bottom"
          placeholder="blur"
          // priority
        ></Image>
        <div className="imgGradientBottomUp absolute bottom-0 h-64 w-full lg:hidden"></div>
        <div className="imgGradientTopToBottom absolute h-56 w-full lg:hidden"></div>
      </div>

      <div className="min-h-screen lg:mx-auto lg:max-w-7xl">
        <div className=" h-[530px] w-full lg:mt-10 lg:h-[450px] lg:w-5/12 lg:pt-20 xl:w-3/5">
          <div className="mx-auto flex w-fit flex-col items-center text-center text-4xl font-extrabold tracking-tight text-white lg:text-left xl:text-5xl 2xl:text-6xl">
            <div>
              Welcome{' '}
              <span className="lg:hidden">
                back <br />
              </span>
              <span className="hidden lg:inline">
                to your favorite bike shop
              </span>{' '}
              <span className="text-accentBlue">{userData.displayName}</span>!
            </div>
          </div>
          <div className="mt-3 text-center text-lg font-light lg:w-4/6 lg:text-left">
            Search from a wide range of bikes available at our locations all
            around Serbia!
          </div>
        </div>
        <Searchbox className="mx-1 mt-5 lg:mx-auto "></Searchbox>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    const userSnap = await getDoc(doc(db, 'users', uid));

    const isAdmin: boolean | undefined = userSnap.data()?.isAdmin;

    if (isAdmin) {
      return {
        redirect: {
          destination: 'admin',
        },
        props: [],
      };
    }

    return {
      props: {
        userData: userToJSON(userSnap.data()),
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/',
      },
      props: [],
    };
  }
};

export default Home;
