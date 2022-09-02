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
