import { createContext, useContext, useEffect, useState } from 'react';
// import { auth } from './firebaseInit'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  UserCredential,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
  signInWithRedirect,
  GoogleAuthProvider,
  getRedirectResult,
} from 'firebase/auth';
import nookies from 'nookies';
import { auth, db, storage } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Router, { useRouter } from 'next/router';
import {
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { UserData } from '../lib/dbTypes';
import { deleteObject, ref } from 'firebase/storage';

type Auth = {
  user: FirebaseUser | null | undefined;
  userData: UserData | undefined | null; //TOO MUCH RE-RENDERING CONSIDER useRef
  // userPath: string;
  getUser: () => FirebaseUser | null;
  login: (
    email: string,
    password: string,
  ) => Promise<UserCredential | undefined>;
  loginGoogle: () => Promise<UserCredential | null>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<UserCredential | undefined>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<Auth>({
  user: undefined,
  userData: undefined,
  // userPath: '',
  getUser: () => null,
  login: async () => undefined,
  loginGoogle: async () => null,
  changePassword: async () => undefined,
  deleteAccount: async () => undefined,
  logout: async () => {},
  signUp: async () => undefined,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | undefined | null>(
    undefined,
  );
  const router = useRouter();

  async function login(email: string, password: string) {
    console.log('login');
    const cred = await signInWithEmailAndPassword(auth, email, password);

    return cred;
  }

  const loginGoogle = async () => {
    await signInWithRedirect(auth, new GoogleAuthProvider());

    const result = await getRedirectResult(auth);
    if (result) {
      // This is the signed-in user
      const user = result.user;
      const userSnap = await getDoc(doc(db, 'users', user.uid));

      if (!userSnap.exists()) {
        const createdAt: Date = new Date();
        createdAt.setHours(0, 0, 0, 0);
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: Timestamp.fromDate(createdAt),
          balance: 0,
          reviews: 0,
          rides: 0,
        });
      } else {
        setUserData(userSnap.data() as UserData);
      }
    }
    return result;
  };

  async function changePassword(oldPassword: string, newPassword: string) {
    if (user && user.email) {
      const cred = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
    }
  }

  async function deleteAccount(password: string) {
    if (user && user.email) {
      await deleteDoc(doc(db, 'users', user.uid));
      try {
        await deleteObject(ref(storage, `profilePictures/${user.uid}.jpeg`));
        await deleteObject(ref(storage, `profilePictures/${user.uid}.jpg`));
        await deleteObject(ref(storage, `profilePictures/${user.uid}.png`));
      } catch (error: any) {
        if (error.code !== 'storage/object-not-found') console.error(error);
      }

      const batch = writeBatch(db);
      const userReservationsSnap = await getDocs(
        query(
          collectionGroup(db, 'reservations'),
          where('uid', '==', user.uid),
        ),
      );
      userReservationsSnap.forEach((res) => {
        batch.delete(res.ref);
      });
      batch.commit();

      const cred = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, cred);
      deleteUser(user).then(() => {
        Router.push('/');
      });
    }
  }

  async function logout() {
    await signOut(auth);
    nookies.set(undefined, 'token', '');
    router.push('/');
  }

  async function signUp(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }

  function getUser() {
    return auth.currentUser;
  }

  useEffect(() => {
    let unsubscribe;
    async function fetchData() {
      if (user) {
        const ref = doc(db, 'users', user.uid);
        // setUserPath(ref.path);
        const token = await user.getIdToken();
        nookies.set(undefined, 'token', token, {});
        unsubscribe = onSnapshot(ref, (doc) => {
          setUserData(doc.data() as UserData);
        });
        // setLoading(false);
      } else {
        setUserData(null);
        nookies.set(undefined, 'token', '', {});
      }
    }
    fetchData();

    return unsubscribe;
  }, [user]);

  const value: Auth = {
    user,
    userData,
    // userPath,
    getUser,
    login,
    loginGoogle,
    changePassword,
    deleteAccount,
    logout,
    signUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
