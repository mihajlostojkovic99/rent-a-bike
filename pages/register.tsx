import type { NextPage } from 'next';
import Image from 'next/image';
import Button from '../components/button';
import Layout from '../components/layout';
import Searchbox from '../components/searchbox';
import bike from '../public/bg_bike.jpg';

const RegisterPage: NextPage = () => {
  return (
    <>
      <Layout>
        <div>
          <div className="mt-2 w-full lg:mt-5">
            <div className="mx-auto flex flex-col items-center text-center text-2xl font-extrabold tracking-tight text-white lg:text-4xl">
              <div>Create your GoBike account.</div>
            </div>
          </div>
          <div className="mx-auto mt-5 flex max-w-xl flex-col items-center rounded-md bg-offWhite px-4 text-justBlack">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered input-accent mt-4 w-full bg-offWhite"
            />

            <input
              type="text"
              placeholder="Username"
              className="input input-bordered input-accent mt-4 w-full bg-offWhite"
            />

            <input
              type="text"
              placeholder="Name"
              className="input input-bordered input-accent mt-4 w-full bg-offWhite"
            />

            <input
              type="text"
              placeholder="Surname"
              className="input input-bordered input-accent mt-4 w-full bg-offWhite"
            />

            <input
              type="password"
              placeholder="Password"
              className="input input-bordered input-accent mt-4 w-full bg-offWhite"
            />

            <input
              type="password"
              placeholder="Confirm password"
              className="input input-bordered input-accent mt-4 w-full bg-offWhite"
            />

            <label className="btn btn-outline btn-accent mt-4 w-full text-lg normal-case">
              Upload profile image
              <input type="file" className="hidden" />
            </label>

            <div className="mt-4 flex h-32 w-32 items-center justify-center bg-accentBlue text-center font-bold lg:h-48 lg:w-48">
              Ovde ide prikaz profilne
            </div>

            <button className="btn btn-accent my-4 h-16 text-xl normal-case">
              Create an account
            </button>
          </div>
          {/* <div className="mt-8 h-96 w-full"></div> */}
        </div>
      </Layout>
    </>
  );
};

export default RegisterPage;
