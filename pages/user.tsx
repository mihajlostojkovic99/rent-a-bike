import { NextPage } from 'next';
import Image from 'next/image';
import Avatar from '../components/avatar';
import Layout from '../components/layout';
import { useAuth } from '../utils/useAuth';

const UserPage: NextPage = () => {
  const { user } = useAuth();
  console.log(user);

  return (
    <>
      <Layout>
        <div className="mx-auto min-h-screen max-w-sm tracking-tight text-justBlack lg:max-w-7xl">
          <div className="w-full rounded-md bg-offWhite p-3">
            <div className="w-full rounded-md bg-accentBlue/10 p-3">
              <Avatar classNameSize="w-[160px]" />
              <div className="text-2xl font-bold tracking-tighter">
                {user?.displayName}{' '}
                <sup className="text-base font-extrabold text-gold">GOLD</sup>
                <button className="btn btn-accent btn-sm ml-5 normal-case">
                  Change
                </button>
              </div>
              <div className="mt-3 text-lg font-bold">
                Age: <span className="font-normal">22</span>
                <button className="btn btn-accent btn-sm ml-5 normal-case">
                  Change
                </button>
              </div>
              <div className="mt-3 text-lg font-bold">
                Location: <span className="font-normal">Belgrade</span>
                <button className="btn btn-accent btn-sm ml-5 normal-case">
                  Change
                </button>
              </div>
              <div className="mt-3 w-full rounded-md bg-accentBlue/10 p-3">
                <div className="text-lg font-bold">About me</div>
                <div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Aliquam voluptates numquam non vitae quae, ratione explicabo
                  eveniet soluta expedita doloremque ipsam temporibus dolore hic
                  est accusantium cum impedit quaerat. Alias quaerat nihil
                  asperiores cumque consequatur quidem, minus eligendi rerum
                  laborum.
                </div>
                <button className="btn btn-accent mt-3 w-full text-lg normal-case">
                  Edit bio
                </button>
              </div>
            </div>
            <div className="mt-3 w-full rounded-md bg-accentBlue/10 p-3">
              Cash balance
            </div>
            <div className="mt-3 w-full rounded-md bg-accentBlue/10 p-3">
              <div className="w-full text-center text-2xl font-bold">
                No pending reservations.
              </div>
            </div>
            <div className="mt-3 w-full rounded-md bg-accentBlue/10 p-3">
              Stats
            </div>
            <div
              data-theme="dangertheme"
              className="mt-3 w-full rounded-md bg-red-600/20 p-3"
            >
              <button className="btn btn-accent w-full text-xl font-bold normal-case text-offWhite">
                Change password
              </button>
              <button className="btn btn-accent mt-3 w-full text-xl font-bold normal-case text-offWhite">
                Delete account
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default UserPage;
