import { Timestamp } from 'firebase/firestore';

// export type UserData = {
//   uid: string;
//   displayName: string;
//   photoURL: string;
//   aboutMe: string;
//   birthday: number;
//   createdAt: number;
//   balance: number;
//   city: string;
//   reviews: number;
//   rides: number;
//   isAdmin: boolean;
// };

export type UserData = {
  uid: string;
  displayName: string;
  photoURL: string;
  aboutMe: string;
  birthday: Timestamp;
  createdAt: Timestamp;
  balance: number;
  city: string;
  reviews: number;
  rides: number;
  isAdmin: boolean;
};

export type EmployeeData = {
  uid: string;
  displayName: string;
  isAdmin: boolean;
};

export type Bike = {
  id: string;
  brand: string | null;
  model: string | null;
  pricePerHour: number;
  year: number | null;
  type: string | null;
  speeds: number | null;
  brakes: string | null;
  photoURL: string | null;
  isElectric: boolean | null;
  rating: number;
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
  uid: string;
  rating: number;
  displayName: string;
  photoURL: string;
  text: string;
};

export type Reservation = {
  id: string;
  uid: string;
  bikeId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  bikeModel: string;
  location: string;
};
