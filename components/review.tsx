import { FlagIcon, StarIcon } from '@heroicons/react/solid';
import { doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { bikeTypes } from '../lib/bikeTypes';
import { Review } from '../lib/dbTypes';
import { db } from '../utils/firebase';
import Avatar from './avatar';

type ReviewProps = {
  review: Review;
  reportOnClick?: () => void;
  children?: React.ReactNode;
};

const ReviewComponent = ({ review, reportOnClick, children }: ReviewProps) => {
  return (
    <div className="flex min-h-[10rem] w-full rounded-md bg-accentBlue/10 p-3 tracking-tighter lg:h-full lg:rounded-3xl xl:p-6">
      <div className="flex h-full w-fit flex-col items-center justify-evenly">
        <Avatar imageSrc={review.photoURL} />
        {reportOnClick !== undefined && (
          <>
            <label
              htmlFor="report"
              className="btn btn-circle btn-outline btn-error btn-sm"
            >
              <FlagIcon className="h-6 w-6" />
            </label>
            <input type="checkbox" id="report" className="modal-toggle" />
            <label
              htmlFor="report"
              className="modal modal-bottom cursor-pointer sm:modal-middle"
            >
              <label
                className="modal-box relative bg-offWhite text-justBlack"
                htmlFor=""
              >
                <h3 className="text-lg font-bold">
                  Are you sure you want to report this comment?
                </h3>
                <div className="btn-group mt-4 w-full">
                  <label
                    className="btn btn-error w-1/2 text-xl"
                    htmlFor="report"
                    onClick={reportOnClick}
                  >
                    Yes
                  </label>
                  <label
                    htmlFor="report"
                    className="btn btn-accent w-1/2 text-xl"
                  >
                    No
                  </label>
                </div>
              </label>
            </label>
          </>
        )}
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
          Rated <StarIcon className="ml-1 h-6 w-6 stroke-black text-gold" />
          {review.rating}/5
        </div>
      </div>
      {children}
    </div>
  );
};

export default ReviewComponent;
