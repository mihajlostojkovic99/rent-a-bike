import type { NextPage } from 'next';
import Image from 'next/image';
import Button from '../components/button';
import Layout from '../components/layout';
import Searchbox from '../components/searchbox';
import bike from '../public/bg_bike.jpg';

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <div>
          <div className="absolute -top-40 -z-10 w-full overflow-hidden">
            <div className="relative h-[1050px] w-full">
              <Image
                src={bike}
                alt="BIKE IMAGE"
                layout="fill"
                objectFit="cover"
                objectPosition="bottom"
              ></Image>
              <div className="absolute bottom-0 h-40 w-full bg-gradient-to-t from-white"></div>
            </div>
          </div>
          <div className="absolute top-60 w-full">
            <div className="mx-auto flex w-fit flex-col items-center text-7xl font-extrabold tracking-tight">
              <div>Book your next best ride with us.</div>
              <Button className="mt-20 h-24 w-72 text-5xl outline outline-2 outline-white/40">
                Join now
              </Button>
            </div>
          </div>
          <Searchbox className="mt-[28rem]"></Searchbox>
        </div>
      </Layout>
    </>
  );
};

export default Home;
