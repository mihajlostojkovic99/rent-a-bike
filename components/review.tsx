import { FlagIcon, StarIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import Link from 'next/link';
import { Review } from '../lib/dbTypes';
import cx from 'classnames';

type ReviewProps = {
  review: Review;
  reportOnClick?: () => void;
  children?: React.ReactNode;
};

const ReviewComponent = ({ review, reportOnClick, children }: ReviewProps) => {
  return (
    <div
      className={cx(
        'flex w-full rounded-md bg-accentBlue/10 p-3 tracking-tighter lg:h-full lg:rounded-3xl xl:p-6',
        reportOnClick !== undefined ? 'min-h-[10rem]' : 'min-h-[9.2rem]',
      )}
    >
      <div className="flex h-full w-fit flex-col items-center justify-evenly">
        <div className="avatar">
          <div className="mask mask-squircle relative w-14 bg-accentBlue">
            <Image
              src={review.photoURL}
              alt="DELETED"
              layout="fill"
              objectFit="cover"
              objectPosition="bottom"
            />
          </div>
        </div>

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
              <a className="underline">{review.displayName}</a>
            </Link>{' '}
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
