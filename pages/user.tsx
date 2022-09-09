import { TextField, ThemeProvider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Avatar from '../components/avatar';
import Layout from '../components/layout';
import { muiTheme2 } from '../utils/datePicker';
import { db, profilePictures, userToJSON } from '../utils/firebase';
import { useAuth } from '../utils/useAuth';
import {
  collection,
  collectionGroup,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import cx from 'classnames';
import { differenceInDays, differenceInYears } from 'date-fns';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import PasswordPopup from '../components/passwordPopup';
import DeletePopup from '../components/deletePopup';
import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import { verifyIdToken } from '../utils/firebaseAdmin';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Reservation, UserData } from '../lib/dbTypes';

type FormData = {
  firstName: string;
  lastName: string;
  birthday: Date;
  city: string;
  aboutMe: string;
  profilePicture: File[];
};

type UserPageProps = {
  serverUserDataJSON: string;
  userPath: string;
  reservationsJSON: string;
};

const UserPage = ({
  serverUserDataJSON,
  userPath,
  reservationsJSON,
}: UserPageProps) => {
  console.log('RE-RENDERED USER PAGE');

  const serverUserData: UserData = JSON.parse(serverUserDataJSON);
  const reservations: Reservation[] = JSON.parse(reservationsJSON);

  const { user } = useAuth();

  const userRef = useRef<DocumentReference<DocumentData> | null>(null);
  useEffect(() => {
    if (user) {
      userRef.current = doc(db, 'users', user.uid);
    }
  }, [user]);
  const [realtimeUserData] = useDocumentData(userRef.current);

  const userData = (realtimeUserData as UserData) || serverUserData;

  const {
    uid,
    displayName,
    photoURL,
    aboutMe,
    balance,
    birthday,
    createdAt,
    city,
    reviews,
    rides,
  } = {
    ...userData,
    birthday: userData.birthday
      ? new Date(userData.birthday.seconds * 1000)
      : null,
    createdAt: new Date(userData.createdAt.seconds * 1000),
    city: userData.city || 'Unknown',
    aboutMe: userData.aboutMe || '',
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      firstName: displayName.split(' ')[0],
      lastName: displayName.split(' ')[1],
      birthday: birthday ? birthday : new Date(),
      city: city,
      aboutMe: aboutMe,
    },
  });
  const newPicture = watch('profilePicture');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setLoading(true);
    const newName = `${data.firstName} ${data.lastName}`;
    var newPhotoURL: string | null = null;

    if (data.profilePicture && data.profilePicture.length > 0) {
      const photoRef = ref(
        profilePictures,
        `${uid}.${data.profilePicture[0].type.split('/')[1]}`,
      );
      const uploadTask = await uploadBytes(photoRef, data.profilePicture[0]);
      newPhotoURL = await getDownloadURL(uploadTask.ref);
    }

    const userRef = doc(db, userPath);

    await updateDoc(userRef, {
      photoURL: newPhotoURL,
      displayName: newName,
      aboutMe: data.aboutMe,
      birthday: Timestamp.fromDate(data.birthday),
      city: data.city,
    });

    await updateProfile(user, {
      displayName: newName,
      photoURL: newPhotoURL,
    });

    setLoading(false);
    setEditMode(false);
  };

  return (
    <>
      <Layout>
        <div className="mx-auto min-h-screen tracking-tight text-justBlack lg:max-w-7xl">
          <div className="mx-2 rounded-md bg-offWhite p-3 lg:mx-0 lg:grid lg:grid-cols-[minmax(0,_3fr)_3fr_2fr] lg:grid-rows-[15rem_15rem_15rem] lg:gap-6 lg:rounded-3xl lg:p-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="lg:row-span-3 lg:h-full lg:w-full"
            >
              <div className="flex w-full flex-col rounded-md bg-accentBlue/10 p-3 lg:h-full lg:rounded-3xl xl:p-6">
                <div className="relative">
                  {editMode ? (
                    <Avatar
                      className="indicator my-1"
                      classNameSize="w-40"
                      classNameText="text-7xl"
                      imageSrc={
                        newPicture && newPicture.length > 0
                          ? URL.createObjectURL(newPicture[0])
                          : null
                      }
                    >
                      <input
                        {...register('profilePicture')}
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg"
                      />
                      <span className="badge indicator-item badge-accent">
                        Click to change
                      </span>
                    </Avatar>
                  ) : (
                    <Avatar
                      imageSrc={photoURL}
                      className="my-1"
                      classNameSize="w-40 xl:w-56"
                      classNameText="text-7xl"
                      priority
                    />
                  )}
                </div>

                <div className="text-2xl font-bold tracking-tighter lg:ml-1 xl:text-4xl">
                  {editMode ? (
                    <div className="flex w-full gap-1">
                      <div className="form-control w-1/2">
                        <input
                          {...register('firstName', {
                            required: 'Required field',
                          })}
                          type="text"
                          placeholder="First name"
                          className="input input-bordered input-accent rounded-[4px] border-black/[0.23] bg-transparent"
                        />
                        {errors.firstName && (
                          <span className="label-text-alt tracking-normal text-red-600">
                            {errors.firstName.message}
                          </span>
                        )}
                      </div>
                      <div className="form-control w-1/2">
                        <input
                          {...register('lastName', {
                            required: 'Required field',
                          })}
                          type="text"
                          placeholder="Last name"
                          className="input input-bordered input-accent rounded-[4px] border-black/[0.23] bg-transparent"
                        />
                        {errors.lastName && (
                          <span className="label-text-alt tracking-normal text-red-600">
                            {errors.lastName.message}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {displayName}{' '}
                      <sup className="text-base font-extrabold text-gold lg:text-base xl:text-xl">
                        GOLD
                      </sup>
                    </>
                  )}
                </div>
                <div className="lg:ml-1">
                  <div className="mt-3 flex items-center gap-1 text-lg font-bold">
                    <div>Age: </div>
                    {editMode ? (
                      <ThemeProvider theme={muiTheme2}>
                        <Controller
                          name="birthday"
                          control={control}
                          rules={{}}
                          render={({
                            field: { onChange, name, value },
                            formState: { errors },
                          }) => (
                            <>
                              <DatePicker
                                renderInput={(props) => (
                                  <TextField
                                    size="small"
                                    className="w-48 tracking-tight lg:w-52"
                                    {...props}
                                  />
                                )}
                                inputFormat={'dd/MM/yyyy'}
                                disableFuture
                                value={value || ''}
                                onChange={(newDate) => {
                                  onChange(newDate);
                                }}
                                label="Birthday"
                              />
                              {errors.birthday && (
                                <span>{errors.birthday.message}</span>
                              )}
                            </>
                          )}
                        ></Controller>
                      </ThemeProvider>
                    ) : (
                      <span className="font-normal">
                        {birthday
                          ? differenceInYears(new Date(), birthday)
                          : 'Unknown'}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-lg font-bold">
                    City:{' '}
                    {editMode ? (
                      <input
                        {...register('city')}
                        type="text"
                        className="input input-bordered input-accent input-sm w-48 rounded-[4px] border-black/[0.23] bg-transparent"
                      />
                    ) : (
                      <span className="font-normal">{city}</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 w-full rounded-md bg-accentBlue/10 p-3 lg:grow lg:rounded-3xl xl:p-6">
                  <div className="text-lg font-bold">About me</div>
                  {editMode ? (
                    <textarea
                      {...register('aboutMe')}
                      className="textarea textarea-bordered h-56 w-full resize-none bg-transparent lg:h-60"
                      maxLength={400}
                    ></textarea>
                  ) : (
                    <div>{aboutMe}</div>
                  )}
                </div>
                {editMode ? (
                  <div className="btn-group w-full">
                    <button
                      className={cx(
                        'btn btn-accent mt-3 grow text-lg normal-case lg:rounded-2xl',
                        {
                          loading: loading,
                        },
                      )}
                      type="submit"
                    >
                      Accept
                    </button>
                    <button
                      data-theme="dangertheme"
                      onClick={() => {
                        reset();
                        setEditMode(false);
                      }}
                      className="btn btn-accent mt-3 grow text-lg normal-case lg:rounded-2xl"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="btn btn-accent mt-3 w-full text-lg normal-case lg:rounded-2xl"
                  >
                    Edit profile
                  </button>
                )}
              </div>
            </form>
            <div className="mt-3 flex w-full justify-center rounded-md bg-accentBlue/10 p-3 lg:mt-0 lg:rounded-3xl lg:p-6">
              <div className="stats stats-vertical h-full w-full bg-slate-700 text-offWhite lg:rounded-3xl">
                <div className="stat flex flex-col items-center justify-between border-b border-b-slate-600 lg:py-2">
                  <div className="stat-title">Account balance</div>
                  <div className="stat-value">${balance}</div>
                </div>
                <div className="stat my-auto lg:py-2">
                  <div className="btn-group  w-full">
                    <button
                      className={cx('btn btn-accent w-1/2 lg:rounded-2xl', {
                        loading: loading,
                      })}
                      onClick={async () => {
                        setLoading(true);
                        const userRef = doc(db, userPath);
                        await updateDoc(userRef, {
                          balance: balance + 50,
                        });
                        setLoading(false);
                      }}
                    >
                      Add funds
                    </button>
                    <button
                      data-theme="dangertheme"
                      className={cx('btn btn-accent w-1/2 lg:rounded-2xl', {
                        loading: loading,
                      })}
                      onClick={async () => {
                        setLoading(true);
                        const userRef = doc(db, userPath);
                        if (balance >= 50) {
                          await updateDoc(userRef, {
                            balance: balance - 50,
                          });
                        } else {
                          await updateDoc(userRef, {
                            balance: 0,
                          });
                        }
                        setLoading(false);
                      }}
                    >
                      Remove funds
                    </button>
                  </div>
                  <div className="stat-desc mt-1 text-center lg:text-sm">
                    add/remove $50
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex w-full flex-col gap-2 rounded-md bg-accentBlue/10 p-2 lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-4 lg:mt-0 lg:rounded-3xl">
              {reservations.length > 0 ? (
                <div className="w-full text-center text-2xl font-bold">
                  Upcoming reservations.
                </div>
              ) : (
                <div className="w-full text-center text-2xl font-bold">
                  No pending reservations.
                </div>
              )}
              {reservations.map((res) => {
                return (
                  <div
                    key={res.id}
                    className="flex w-full flex-col rounded-md bg-accentBlue/10 p-3 tracking-tighter lg:rounded-3xl xl:p-6"
                  >
                    <div className="text-center">
                      <div>
                        Bike: <span className="font-bold">{res.bikeModel}</span>
                      </div>
                      <div>
                        At: <span className="font-bold">{res.location}</span>
                      </div>
                    </div>

                    <div className="divider my-1"></div>

                    <div className="flex justify-between text-sm">
                      <div>
                        From:{' '}
                        {new Intl.DateTimeFormat(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(new Date(res.startDate.seconds * 1000))}
                      </div>
                      <div>
                        To:{' '}
                        {new Intl.DateTimeFormat(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(new Date(res.endDate.seconds * 1000))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 w-full rounded-md bg-accentBlue/10 p-3 lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3 lg:mt-0 lg:rounded-3xl lg:p-6">
              <div className="stats stats-vertical h-full w-full bg-accentBlue tracking-normal text-offWhite shadow lg:rounded-3xl">
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
            <div
              data-theme="dangertheme"
              className="mt-3 flex w-full flex-col justify-evenly rounded-md bg-red-600/20 p-3 lg:col-start-3 lg:row-start-3 lg:row-end-4 lg:mt-0 lg:rounded-3xl lg:p-6"
            >
              <label
                htmlFor="password"
                className="btn btn-accent w-full text-xl font-bold normal-case text-offWhite lg:h-16 lg:rounded-2xl"
              >
                Change password
              </label>
              <label
                htmlFor="delete"
                className="btn btn-accent mt-3 w-full text-xl font-bold normal-case text-offWhite lg:h-16 lg:rounded-2xl"
              >
                Delete account
              </label>
              <PasswordPopup></PasswordPopup>
              <DeletePopup></DeletePopup>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    const userRef = doc(db, 'users', uid);

    const [resSnap, userSnap] = await Promise.all([
      getDocs(
        query(
          collectionGroup(db, 'reservations'),
          where('uid', '==', uid),
          where('startDate', '>', Timestamp.fromDate(new Date())),
          limit(3),
        ),
      ),
      getDoc(userRef),
    ]);

    const userData: UserData = userSnap.data() as UserData;

    const reservations: Reservation[] = [];
    resSnap.forEach((res) => {
      reservations.push({
        id: res.id,
        uid: res.data().uid,
        startDate: res.data().startDate,
        endDate: res.data().endDate,
        bikeModel: res.data().bikeModel,
        location: res.data().location,
      });
    });

    console.log(
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA SSR UserData: ',
      userData,
    );
    console.log(
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA SSR Reservations: ',
      reservations,
    );

    return {
      props: {
        // serverUserData: userToJSON(userData),
        serverUserDataJSON: JSON.stringify(userData),
        userPath: userRef.path,
        reservationsJSON: JSON.stringify(reservations),
      },
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { location: '/' });
    context.res.end();
    return { props: {} };
  }
};

export default UserPage;
