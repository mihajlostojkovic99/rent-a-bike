import { createContext, useContext, useEffect, useState } from 'react';
// import { auth } from './firebaseInit'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  UserCredential,
  reauthenticateWithCredential,
  AuthCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
  signInWithRedirect,
  GoogleAuthProvider,
} from 'firebase/auth';
import nookies from 'nookies';
import { auth, db, firebase } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Router, { useRouter } from 'next/router';
import { deleteDoc, doc, DocumentData, onSnapshot } from 'firebase/firestore';
import { UserData } from '../lib/dbTypes';

type Auth = {
  user: FirebaseUser | null | undefined;
  userData: UserData | undefined | null; //TOO MUCH RE-RENDERING CONSIDER useRef
  // userPath: string;
  getUser: () => FirebaseUser | null;
  login: (
    email: string,
    password: string,
  ) => Promise<UserCredential | undefined>;
  loginGoogle: () => Promise<UserCredential | undefined>;
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
  loginGoogle: async () => undefined,
  changePassword: async () => undefined,
  deleteAccount: async () => undefined,
  logout: async () => {},
  signUp: async () => undefined,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  // const [user, setUser] = useState<FirebaseUser | null | undefined>();
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | undefined | null>(
    undefined,
  );
  // console.log('USEAUTH');
  // const [userPath, setUserPath] = useState<string>('');
  // const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  async function login(email: string, password: string) {
    console.log('login');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // Router.push('home');
    // router.push('home');
    // console.log('bbbb');
    return cred;
  }

  const loginGoogle = async () => {
    const cred = await signInWithRedirect(auth, new GoogleAuthProvider());
    // router.push('home');
    // console.log('bbbb');
    return cred;
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
        // nookies.set(undefined, 'token', '', {});
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
