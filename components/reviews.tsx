import { FlagIcon, StarIcon } from '@heroicons/react/solid';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { bikeTypes } from '../lib/bikeTypes';
import { Bike, Review } from '../lib/dbTypes';
import { db } from '../utils/firebase';
import Avatar from './avatar';

type CommentsProps = {
  bike: Bike;
};

const Reviews = ({ bike }: CommentsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  console.log(reviews);

  useEffect(() => {
    const type = bikeTypes.find((type) => {
      if (type.label === bike.type) return true;
      else return false;
    });

    const fetchReviews = async () => {
      if (type) {
        const reviewsRef = await getDocs(
          collection(db, 'bikes', type.value, 'models', bike.id, 'reviews'),
        );

        const tmpReviews: Review[] = [];

        reviewsRef.forEach((reviewRef) => {
          tmpReviews.push({
            id: reviewRef.id,
            displayName: reviewRef.data().displayName,
            photoURL: reviewRef.data().photoURL,
            userId: reviewRef.data().userId,
            rating: reviewRef.data().rating,
            text: reviewRef.data().text,
          });
        });

        setReviews(tmpReviews);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="flex w-full flex-col rounded-md bg-accentBlue/10 p-3 lg:h-full lg:rounded-3xl xl:p-6">
      <div className="w-full text-center text-3xl font-extrabold tracking-tighter">
        Reviews
      </div>
      <div className="flex items-center text-lg font-semibold">
        <div>Average rating is</div>
        <StarIcon className="ml-1 h-6 w-6 stroke-black text-gold" />
        <div>{bike.rating?.toFixed(1)}/5</div>
      </div>
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
                    <Link href={`/users/${review.userId}`}>
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
