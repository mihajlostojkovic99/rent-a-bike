import { TextField, ThemeProvider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Avatar from '../../components/avatar';
import Layout from '../../components/layout';
import { muiTheme2 } from '../../utils/datePicker';
import { db, profilePictures, userToJSON } from '../../utils/firebase';
import { useAuth } from '../../utils/useAuth';
import {
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import nookies from 'nookies';
import cx from 'classnames';
import { differenceInDays, differenceInYears } from 'date-fns';
import { verifyIdToken } from '../../utils/firebaseAdmin';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import PasswordPopup from '../../components/passwordPopup';
import DeletePopup from '../../components/deletePopup';

type FormData = {
  firstName: string;
  lastName: string;
  birthday: Date;
  city: string;
  aboutMe: string;
  profilePicture: File[];
};

type UserPageProps = {
  userDetails: DocumentData;
  userPath: string;
};

const UserPage = ({ userDetails }: UserPageProps) => {
  const { user } = useAuth();

  const userData = userDetails;

  const {
    uid,
    displayName,
    photoURL,
    aboutMe,
    birthday,
    createdAt,
    city,
    reviews,
    rides,
  } = {
    ...(userData as UserData),
    birthday: userData.birthday
      ? typeof userData.birthday === 'number'
        ? new Date(userData.birthday)
        : userData.birthday.toDate()
      : null,
    createdAt:
      typeof userData.createdAt === 'number'
        ? new Date(userData.createdAt)
        : userData.createdAt.toDate(),
    city: userData.city || 'Unknown',
    aboutMe: userData.aboutMe || '',
  };

  //   console.log(sameUser);

  // console.log(user);

  return (
    <>
      <Layout>
        <div className="mx-auto min-h-screen tracking-tight text-justBlack lg:max-w-7xl">
          <div className="mx-2 rounded-md bg-offWhite p-3 lg:mx-0 lg:grid lg:grid-cols-[minmax(0,_3fr)_3fr_2fr] lg:grid-rows-[14rem_14rem_13rem] lg:gap-6 lg:rounded-3xl lg:p-6">
            <div className="flex w-full flex-col rounded-md bg-accentBlue/10 p-3 lg:row-start-1 lg:row-end-4 lg:rounded-3xl xl:p-6">
              <div className="relative">
                <Avatar
                  imageSrc={photoURL}
                  className="my-1"
                  classNameSize="w-40 xl:w-56"
                  classNameText="text-7xl"
                  priority
                />
              </div>

              <div className="text-2xl font-bold tracking-tighter lg:ml-1 xl:text-4xl">
                <>
                  {displayName}{' '}
                  <sup className="text-base font-extrabold text-gold lg:text-base xl:text-xl">
                    GOLD
                  </sup>
                </>
              </div>
              <div className="lg:ml-1">
                <div className="mt-3 flex items-center gap-1 text-lg font-bold">
                  <div>Age: </div>

                  <span className="font-normal">
                    {birthday
                      ? differenceInYears(new Date(), birthday)
                      : 'Unknown'}
                  </span>
                </div>
                <div className="mt-3 text-lg font-bold">
                  City: <span className="font-normal">{city}</span>
                </div>
              </div>
              <div className="mt-3 w-full rounded-md bg-accentBlue/10 p-3 lg:grow lg:rounded-3xl xl:p-6">
                <div className="text-lg font-bold">About me</div>

                <div>{aboutMe}</div>
              </div>
            </div>
            <div className="mt-3 w-full rounded-md bg-accentBlue/10 p-3 lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-4 lg:mt-0 lg:rounded-3xl">
              <div className="mb-4 w-full text-center text-2xl font-bold">
                Latest comments:
              </div>
              <div>No comments to show. wip</div>
            </div>
            <div className="mt-3 w-full rounded-md bg-accentBlue/10 p-3 lg:col-start-2 lg:col-end-4 lg:row-start-1 lg:row-end-2 lg:mt-0 lg:rounded-3xl lg:p-6">
              <div className="stats stats-vertical h-full w-full bg-accentBlue tracking-normal text-offWhite shadow lg:stats-horizontal lg:rounded-3xl">
                <div className="stat flex flex-col items-center justify-center">
                  <div className="stat-title lg:text-xl">Total rides</div>
                  <div className="stat-value lg:text-5xl">{rides}</div>
                  <div className="stat-desc lg:text-sm">
                    accomplished reservations
                  </div>
                </div>

                <div className="stat flex flex-col items-center justify-center">
                  <div className="stat-title lg:text-xl">Activity</div>
                  <div className="stat-value lg:text-5xl">{reviews}</div>
                  <div className="stat-desc lg:text-sm">bike reviews</div>
                </div>

                <div className="stat flex flex-col items-center justify-center">
                  <div className="stat-title lg:text-xl">Experience</div>
                  <div className="stat-value lg:text-5xl">
                    {differenceInDays(new Date(), createdAt)}+ days
                  </div>
                  <div className="stat-desc lg:mt-1 lg:text-sm">
                    member since{' '}
                    <span>{createdAt.toLocaleDateString('sr-RS')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

type UserData = {
  uid: string;
  displayName: string;
  photoURL: string;
  aboutMe: string;
  birthday: number;
  createdAt: number;
  balance: number;
  city: string;
  reviews: number;
  rides: number;
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  try {
    const uid = params?.uid;

    const docRef = doc(db, 'users', uid as string);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    return {
      props: {
        userDetails: userToJSON(data),
        userPath: docRef.path,
      },
    };
  } catch (err) {
    res.writeHead(302, { location: '/' });
    res.end();
    return { props: [] };
  }
};

export default UserPage;
