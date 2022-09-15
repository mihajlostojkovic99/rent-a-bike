import { GetServerSideProps } from 'next';
import Avatar from '../../components/avatar';
import Layout from '../../components/layout';
import { db, profilePictures, userToJSON } from '../../utils/firebase';
import { useAuth } from '../../utils/useAuth';
import {
  collectionGroup,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { differenceInDays, differenceInYears } from 'date-fns';
import { Review, UserData } from '../../lib/dbTypes';
import ReviewComponent from '../../components/review';

type UserPageProps = {
  userDetailsJSON: string;
  userReviewsJSON: string;
};

const AboutMePage = ({ userDetailsJSON, userReviewsJSON }: UserPageProps) => {
  const userDetails: UserData = JSON.parse(userDetailsJSON);
  const userReviews: Review[] = JSON.parse(userReviewsJSON);
  const { user } = useAuth();

  const userData = userDetails;

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

  return (
    <>
      <Layout>
        <div className="mx-auto min-h-screen tracking-tight text-justBlack lg:max-w-7xl">
          <div className="mx-2 rounded-md bg-offWhite p-3 lg:mx-0 lg:grid lg:grid-cols-[minmax(0,_3fr)_3fr_2fr] lg:grid-rows-[12rem_16rem_16rem] lg:gap-6 lg:rounded-3xl lg:p-6">
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
                {displayName}
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
              {userReviews.length > 0 ? (
                <>
                  <div className="mb-1 w-full text-center text-2xl font-bold">
                    My latest reviews:
                  </div>
                  <div className="flex flex-col gap-4">
                    {userReviews.map((review) => {
                      return (
                        <ReviewComponent key={review.id} review={review} />
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="mb-1 w-full text-center text-2xl font-bold">
                  No reviews to show yet.
                </div>
              )}
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

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  try {
    const uid = params?.uid;

    const [userSnap, userReviewsSnap] = await Promise.all([
      getDoc(doc(db, 'users', uid as string)),
      getDocs(
        query(
          collectionGroup(db, 'reviews'),
          where('uid', '==', uid),
          orderBy('createdAt', 'desc'),
          limit(3),
        ),
      ),
    ]);
    const userData: UserData = userSnap.data() as UserData;

    const userReviews: Review[] = [];
    userReviewsSnap.forEach((rev) => {
      userReviews.push({
        createdAt: rev.data().createdAt,
        displayName: rev.data().displayName,
        id: rev.id,
        photoURL: rev.data().photoURL,
        rating: rev.data().rating,
        text: rev.data().text,
        uid: rev.data().uid,
      });
    });

    return {
      props: {
        userDetailsJSON: JSON.stringify(userData),
        userReviewsJSON: JSON.stringify(userReviews),
      },
    };
  } catch (err) {
    console.log(err);
    res.writeHead(302, { location: '/' });
    res.end();
    return { props: {} };
  }
};

export default AboutMePage;
