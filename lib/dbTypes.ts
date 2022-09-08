import { Timestamp } from 'firebase/firestore';

export type UserData = {
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
  isAdmin: boolean;
};

export type Bike = {
  id: string;
  brand: string | null;
  model: string | null;
  pricePerHour: number | null;
  year: number | null;
  type: string | null;
  speeds: number | null;
  brakes: string | null;
  photoURL: string | null;
  isElectric: boolean | null;
  rating: number | null;
};

export type Location = {
  id: string;
  city: string;
  place: string;
};

export type Stock = {
  id: string;
  bikeId: string;
  location: string;
  total: number;
};

export type Review = {
  id: string;
  userId: string;
  rating: number;
  displayName: string;
  photoURL: string;
  text: string;
};

export type Reservation = {
  id: string;
  userId: string;
  startDate: Timestamp;
  endDate: Timestamp;
};
