import { TextField, ThemeProvider } from '@mui/material';
import { DateTimePicker, DatePicker } from '@mui/x-date-pickers';
import { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Avatar from '../components/avatar';
import Layout from '../components/layout';
import { muiTheme2 } from '../utils/datePicker';
import { profilePictures } from '../utils/firebase';
import { useAuth } from '../utils/useAuth';
import card from '../public/card.jpg';
import { differenceInDays, differenceInYears } from 'date-fns';

type FormData = {
  firstName: string;
  lastName: string;
  birthday: Date;
  city: string;
  aboutMe: string;
  profilePicture: File[];
};

const UserPage: NextPage = () => {
  const { user } = useAuth();
  // console.log(user);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      firstName: user?.displayName?.split(' ')[0],
      lastName: user?.displayName?.split(' ')[1],
      birthday: new Date(1999, 9, 8),
      city: 'Belgrade',
      aboutMe:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit.Aliquam voluptates numquam non vitae quae, ratione explicaboeveniet soluta expedita doloremque ipsam temporibus dolore hic est accusantium cum impedit quaerat. Alias quaerat nihil asperiores cumque consequatur quidem, minus eligendi rerum laborum.',
    },
  });
  const newPicture = watch('profilePicture');
  const [imgURL, setImgURL] = useState<string | null | ArrayBuffer>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const creationDate = new Date(user!.metadata.creationTime!);

  const getImgURL = (img: File[]) => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      setImgURL(fileReader.result);
    });
    if (img[0]) {
      fileReader.readAsDataURL(img[0]);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
    setEditMode(false);
  };

  return (
    <>
      {newPicture && getImgURL(newPicture)}
      <Layout>
        <div className="mx-auto min-h-screen max-w-sm tracking-tight text-justBlack lg:max-w-7xl">
          <div className="w-full rounded-md bg-offWhite p-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full rounded-md bg-accentBlue/10 p-3">
                {editMode ? (
                  <Avatar
                    className="indicator my-1"
                    classNameSize="w-40"
                    classNameText="text-7xl"
                    imageSrc={imgURL}
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
                    className="my-1"
                    classNameSize="w-40"
                    classNameText="text-7xl"
                  />
                )}

                <div className="text-2xl font-bold tracking-tighter">
                  {editMode ? (
                    <div className="flex w-full gap-1">
                      <div className="form-control w-1/2">
                        <input
                          {...register('firstName', {
                            required: 'Required field',
                          })}
                          type="text"
                          className="input input-bordered input-accent rounded-[4px] border-black/[0.23] bg-transparent"
                        />
                        {errors.firstName && (
                          <span className="label-text-alt text-red-600">
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
                          className="input input-bordered input-accent rounded-[4px] border-black/[0.23] bg-transparent"
                        />
                        {errors.lastName && (
                          <span className="label-text-alt text-red-600">
                            {errors.lastName.message}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {user?.displayName}{' '}
                      <sup className="text-base font-extrabold text-gold">
                        GOLD
                      </sup>
                    </>
                  )}
                </div>
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
                      {differenceInYears(new Date(), new Date(1999, 9, 8))}
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
                    <span className="font-normal">Belgrade</span>
                  )}
                </div>
                <div className="mt-3 w-full rounded-md bg-accentBlue/10 p-3">
                  <div className="text-lg font-bold">About me</div>
                  {editMode ? (
                    <textarea
                      {...register('aboutMe')}
                      className="textarea textarea-bordered h-56 w-full bg-transparent"
                    ></textarea>
                  ) : (
                    <div>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Aliquam voluptates numquam non vitae quae, ratione
                      explicabo eveniet soluta expedita doloremque ipsam
                      temporibus dolore hic est accusantium cum impedit quaerat.
                      Alias quaerat nihil asperiores cumque consequatur quidem,
                      minus eligendi rerum laborum.
                    </div>
                  )}
                </div>
                {editMode ? (
                  <div className="btn-group w-full">
                    <button
                      className="btn btn-accent mt-3 grow text-lg normal-case"
                      type="submit"
                    >
                      Accept
                    </button>
                    <button
                      data-theme="dangertheme"
                      onClick={() => {
                        reset();
                        setImgURL(null);
                        setEditMode(false);
                      }}
                      className="btn btn-accent mt-3 grow text-lg normal-case"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="btn btn-accent mt-3 w-full text-lg normal-case"
                  >
                    Edit profile
                  </button>
                )}
              </div>
            </form>
            <div className="mt-3 flex w-full justify-center rounded-md bg-accentBlue/10 p-3">
              <div className="stats stats-vertical w-full bg-justBlack text-offWhite lg:stats-horizontal">
                <div className="stat flex flex-col items-center">
                  {/* <div className=" h-20 w-full">
                    <Image
                      src={card}
                      alt="BIKE IMAGE"
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                      // placeholder="blur"
                      // priority
                    ></Image>
                  </div> */}

                  <div className="stat-title">Account balance</div>
                  <div className="stat-value">$400</div>
                  <div className="stat-actions">
                    <div className="btn-group w-full">
                      <button className="btn btn-accent w-1/2 ">
                        Add funds
                      </button>
                      <button
                        data-theme="dangertheme"
                        className="btn btn-accent w-1/2 text-offWhite/90"
                      >
                        Remove funds
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 w-full rounded-md bg-accentBlue/10 p-3">
              <div className="w-full text-center text-2xl font-bold">
                No pending reservations.
              </div>
            </div>
            <div className="mt-3 w-full rounded-md bg-accentBlue/10 p-3">
              <div className="stats stats-vertical w-full bg-accentBlue tracking-normal text-offWhite shadow">
                <div className="stat flex flex-col items-center">
                  <div className="stat-title">Total rides</div>
                  <div className="stat-value">17</div>
                  <div className="stat-desc">accomplished reservations</div>
                </div>

                <div className="stat flex flex-col items-center">
                  <div className="stat-title">Activity</div>
                  <div className="stat-value">11</div>
                  <div className="stat-desc">bike reviews</div>
                </div>

                <div className="stat flex flex-col items-center">
                  <div className="stat-title">Experience</div>
                  <div className="stat-value">
                    {differenceInDays(new Date(), creationDate)}+ days
                  </div>
                  <div className="stat-desc">
                    member since{' '}
                    <span>{creationDate.toLocaleDateString('sr-RS')}</span>
                  </div>
                </div>
              </div>
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
