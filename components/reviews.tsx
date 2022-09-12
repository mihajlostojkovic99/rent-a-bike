import { FlagIcon, StarIcon } from '@heroicons/react/solid';
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDocs,
  limit,
  query,
  runTransaction,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { bikeTypes } from '../lib/bikeTypes';
import { Bike, Review } from '../lib/dbTypes';
import { db } from '../utils/firebase';
import Avatar from './avatar';
import cx from 'classnames';
import { useAuth } from '../utils/useAuth';
import { useRouter } from 'next/router';

type ReviewsProps = {
  bike: Bike;
  className?: string;
};

const Reviews = ({ bike, className }: ReviewsProps) => {
  const { user, userData } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);

  const [canReview, setCanReview] = useState<
    'not rented' | 'already reviewed' | 'can review'
  >('not rented');
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  // console.log(text);

  const type = bikeTypes.find((type) => {
    if (type.label === bike.type) return true;
    else return false;
  });

  useEffect(() => {
    const fetchReviews = async () => {
      if (type && user) {
        const reservationSnap = await getDocs(
          query(
            collectionGroup(db, 'reservations'),
            where('uid', '==', user?.uid),
            where('bikeId', '==', bike.id),
            where('endDate', '<=', Timestamp.fromDate(new Date())),
            limit(1),
          ),
        );

        const reviewsSnap = await getDocs(
          collection(db, 'bikes', type.value, 'models', bike.id, 'reviews'),
        );

        const tmpReviews: Review[] = [];

        reviewsSnap.forEach((reviewRef) => {
          tmpReviews.push({
            id: reviewRef.id,
            displayName: reviewRef.data().displayName,
            photoURL: reviewRef.data().photoURL,
            uid: reviewRef.data().uid,
            rating: reviewRef.data().rating,
            text: reviewRef.data().text,
          });
        });

        if (reservationSnap.empty) setCanReview('not rented');
        if (
          !reservationSnap.empty &&
          tmpReviews.find((review) => {
            if (review.uid === user.uid) return true;
            else return false;
          })
        ) {
          setCanReview('already reviewed');
        }

        if (
          !reservationSnap.empty &&
          !tmpReviews.find((review) => {
            if (review.uid === user.uid) return true;
            else return false;
          })
        ) {
          setCanReview('can review');
        }

        setReviews(tmpReviews);
      }
    };
    fetchReviews();
    console.log('useEffect called');
  }, [bike, type, user]);

  const router = useRouter();

  const handleReview = async () => {
    if (!userData || !user) return;
    setUploading(true);

    await Promise.all([
      // runTransaction(db, async (transaction) => {
      //   const bikeRef = doc(
      //     db,
      //     'bikes',
      //     bikeTypes.find((type) => {
      //       if (type.label === bike.type) return true;
      //       else return false;
      //     })!.value,
      //     'models',
      //     bike.id,
      //   );
      //   const bikeSnap = await transaction.get(bikeRef);

      //   const newRating =
      //     (bikeSnap.data()?.rating + rating) / (reviews.length + 1);
      //   transaction.update(bikeRef, {
      //     rating: newRating,
      //   });
      // }),
      setDoc(
        doc(
          db,
          'bikes',
          bikeTypes.find((type) => {
            if (type.label === bike.type) return true;
            else return false;
          })!.value,
          'models',
          bike.id,
        ),
        {
          rating:
            (bike.rating * reviews.length + rating) / (reviews.length + 1),
        },
        {
          merge: true,
        },
      ),
      addDoc(
        collection(
          db,
          'bikes',
          bikeTypes.find((type) => {
            if (type.label === bike.type) return true;
            else return false;
          })!.value,
          'models',
          bike.id,
          'reviews',
        ),
        {
          displayName: userData.displayName,
          photoURL: user.photoURL,
          rating: rating,
          text: text,
          uid: userData.uid,
        },
      ),
    ]);

    await fetch(`/api/bikes/${bike.id}`);

    // await runTransaction(db, async (transaction) => {
    //   const bikeRef = doc(
    //     db,
    //     'bikes',
    //     bikeTypes.find((type) => {
    //       if (type.label === bike.type) return true;
    //       else return false;
    //     })!.value,
    //     bike.id,
    //   );
    //   const bikeSnap = await transaction.get(bikeRef);

    //   const newRating =
    //     (bikeSnap.data()?.rating + rating) / (reviews.length + 1);
    //   transaction.update(bikeRef, {
    //     rating: newRating,
    //   });
    // });

    // await addDoc(
    //   collection(
    //     db,
    //     'bikes',
    //     bikeTypes.find((type) => {
    //       if (type.label === bike.type) return true;
    //       else return false;
    //     })!.value,
    //     'models',
    //     bike.id,
    //     'reviews',
    //   ),
    //   {
    //     displayName: userData.displayName,
    //     photoURL: userData.photoURL,
    //     rating: rating,
    //     text: text,
    //     uid: userData.uid,
    //   },
    // );

    setUploading(false);
    router.reload();
  };

  return (
    <div
      className={cx(
        'flex w-full flex-col rounded-md bg-accentBlue/10 p-3 lg:h-full lg:rounded-3xl xl:p-6',
        className,
      )}
    >
      <div className="w-full text-center text-3xl font-extrabold tracking-tighter">
        Reviews
      </div>
      <div className="flex items-center text-lg font-semibold">
        <div>Average rating is</div>
        <StarIcon className="ml-1 h-6 w-6 stroke-black text-gold" />
        <div>{bike.rating?.toFixed(1)}/5</div>
      </div>
      {canReview === 'not rented' && (
        <div className="text-justBlack/40">
          You can review this bike after renting it at least once.
        </div>
      )}
      {canReview === 'already reviewed' && (
        <div className="text-justBlack/40">
          You have already reviewed this bike.
        </div>
      )}
      {canReview === 'can review' && (
        <div className="mt-4">
          <div className="flex w-full rounded-md bg-electricGreen/20 p-3 tracking-tighter lg:rounded-3xl xl:p-6">
            <div className="flex h-full w-fit flex-col items-center justify-evenly">
              <Avatar imageSrc={userData?.photoURL} />
              <FlagIcon className="h-6 w-6 text-transparent" />
            </div>
            <div className="divider divider-horizontal" />
            <div className="flex w-full flex-col justify-between">
              <div className="w-full">
                <div className="text-lg font-bold">Write a review:</div>
                <textarea
                  className="textarea textarea-bordered h-32 w-full resize-none bg-transparent"
                  onChange={(e) => setText(e.target.value)}
                  maxLength={200}
                ></textarea>
              </div>
              <div className="mt-4 flex gap-2">
                <div>Rate your experience with the bike </div>
                <div className="rating">
                  <input
                    type="radio"
                    name="rating-1"
                    value={1}
                    className="mask mask-star-2 bg-gold"
                    onChange={(e) => setRating(1)}
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-gold"
                    onChange={(e) => setRating(2)}
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-gold"
                    onChange={(e) => setRating(3)}
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-gold"
                    onChange={(e) => setRating(4)}
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-gold"
                    onChange={(e) => setRating(5)}
                  />
                </div>
              </div>
              <button
                onClick={handleReview}
                className={cx('btn btn-accent mt-4 normal-case', {
                  loading: uploading,
                })}
              >
                Leave a review
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-col gap-4">
        {reviews.map((review) => {
          return (
            <div
              key={review.id}
              className="flex min-h-[10rem] w-full rounded-md bg-accentBlue/10 p-3 tracking-tighter lg:h-full lg:rounded-3xl xl:p-6"
            >
              <div className="flex h-full w-fit flex-col items-center justify-evenly">
                <Avatar imageSrc={review.photoURL} />
                <FlagIcon className="h-6 w-6 text-redDanger" />
              </div>
              <div className="divider divider-horizontal h-full" />
              <div className="flex flex-col justify-between">
                <div>
                  <div className="text-lg font-bold">
                    <Link href={`/users/${review.uid}`}>
                      <a className="underline">{review.displayName} </a>
                    </Link>
                    left a review
                  </div>
                  <div>{review.text}</div>
                </div>
                <div className="flex">
                  Rated{' '}
                  <StarIcon className="ml-1 h-6 w-6 stroke-black text-gold" />
                  {review.rating}/5
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reviews;
