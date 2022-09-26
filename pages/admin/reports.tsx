import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout';
import Searchbox from '../../components/searchbox';
import bike from '../public/home_bike.jpg';
import { useAuth } from '../../utils/useAuth';
import { AuthCheck } from '../../utils/authCheck';
import { verifyIdToken } from '../../utils/firebaseAdmin';
import { db, storage, userToJSON } from '../../utils/firebase';
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import nookies from 'nookies';
import { Review } from '../../lib/dbTypes';
import ReviewComponent from '../../components/review';
import { bikeTypes } from '../../lib/bikeTypes';
import { useRouter } from 'next/router';
import cx from 'classnames';
import { useState } from 'react';
import { deleteObject, ref } from 'firebase/storage';
import { FirebaseError } from 'firebase/app';

type ReportsProps = {
  reportedReviewsJSON: string;
};

const Reports: NextPage<ReportsProps> = ({
  reportedReviewsJSON,
}: ReportsProps) => {
  const router = useRouter();
  const reportedReviews: {
    review: Review;
    path: string;
  }[] = JSON.parse(reportedReviewsJSON);

  const [deletingComment, setDeletingComment] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);

  const handleDeleteComment = async (reportedReview: {
    review: Review;
    path: string;
  }) => {
    const uid = reportedReview.review.uid;
    await deleteDoc(doc(db, reportedReview.path));

    const bikePath = reportedReview.path.split('/reviews/')[0];
    const bikeId = bikePath.substring(bikePath.lastIndexOf('/') + 1);
    const bikeReviewsSnap = await getDocs(collection(db, bikePath, 'reviews'));
    let total = 0;
    bikeReviewsSnap.forEach((review) => {
      total += review.data().rating;
    });

    updateDoc(doc(db, bikePath), {
      rating: total / bikeReviewsSnap.size,
    });

    updateDoc(doc(db, 'users', uid), {
      reviews: increment(-1),
    });

    fetch(`/api/bikes/${bikeId}`);
  };

  const handleDeleteUser = async (reportedReview: {
    review: Review;
    path: string;
  }) => {
    const uid = reportedReview.review.uid;
    fetch(`/api/admin/deleteUser/${uid}`);
    deleteDoc(doc(db, 'users', uid));
    try {
      await deleteObject(ref(storage, `profilePictures/${uid}.jpeg`));
      await deleteObject(ref(storage, `profilePictures/${uid}.jpg`));
      await deleteObject(ref(storage, `profilePictures/${uid}.png`));
    } catch (error: any) {
      if (error.code !== 'storage/object-not-found') console.error(error);
    }
    const batch = writeBatch(db);
    const userReservationsSnap = await getDocs(
      query(collectionGroup(db, 'reservations'), where('uid', '==', uid)),
    );
    userReservationsSnap.forEach((res) => {
      batch.delete(res.ref);
    });
    batch.commit();
    //Kad se obrise user azuriraj potencijalno [userId] rutu za profil korisnika ako prebacis na ISR
  };

  return (
    <Layout>
      <div className="mx-auto flex gap-4 rounded-md bg-offWhite p-3 tracking-tighter text-justBlack lg:max-w-7xl lg:rounded-3xl lg:p-6">
        <div className="flex w-full flex-col rounded-md bg-accentBlue/20 p-3 shadow lg:rounded-3xl xl:p-6">
          <div className="mb-4 w-full text-center text-3xl font-extrabold tracking-tighter">
            Reported reviews.
          </div>
          <div className="flex flex-col gap-4">
            {reportedReviews.map((reportedReview) => {
              return (
                <ReviewComponent
                  key={reportedReview.review.id}
                  review={reportedReview.review}
                >
                  <div className="btn-group btn-group-vertical ml-auto self-center">
                    <button
                      className="btn btn-success normal-case"
                      onClick={async () => {
                        await updateDoc(doc(db, reportedReview.path), {
                          reported: false,
                        });
                        router.reload();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className={cx('btn btn-accent normal-case', {
                        loading: deletingComment,
                      })}
                      onClick={async () => {
                        setDeletingComment(true);

                        await handleDeleteComment(reportedReview);

                        setDeletingComment(false);
                        router.reload();
                      }}
                    >
                      Delete comment
                    </button>
                    <button
                      className={cx('btn btn-error normal-case', {
                        loading: deletingUser,
                      })}
                      onClick={async () => {
                        setDeletingUser(true);
                        await handleDeleteComment(reportedReview);
                        await handleDeleteUser(reportedReview);
                        setDeletingUser(false);
                        router.reload();
                      }}
                    >
                      Delete comment {'&'} user
                    </button>
                  </div>
                </ReviewComponent>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    const [userSnap, reviewsSnap] = await Promise.all([
      getDoc(doc(db, 'users', uid)),
      getDocs(
        query(
          collectionGroup(db, 'reviews'),
          where('reported', '==', true),
          orderBy('createdAt', 'desc'),
        ),
      ),
    ]);

    const isAdmin: boolean | undefined = userSnap.data()?.isAdmin;

    if (!isAdmin) {
      console.log('user is not admin');
      return {
        redirect: {
          destination: '/',
        },
        props: {},
      };
    }

    const reportedReviews: {
      review: Review;
      path: string;
    }[] = [];
    reviewsSnap.forEach((review) => {
      reportedReviews.push({
        path: review.ref.path,
        review: {
          id: review.id,
          createdAt: review.data().createdAt,
          text: review.data().text,
          uid: review.data().uid,
          rating: review.data().rating,
          displayName: review.data().displayName,
          photoURL: review.data().photoURL,
        },
      });
    });

    return {
      props: {
        reportedReviewsJSON: JSON.stringify(reportedReviews),
      },
    };
  } catch (err) {
    console.log('ADMIN REPORTS', err);
    return {
      redirect: {
        destination: '/',
      },
      props: {},
    };
  }
};

export default Reports;
