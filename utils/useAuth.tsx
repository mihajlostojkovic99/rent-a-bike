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
} from 'firebase/auth';
import nookies from 'nookies';
import { auth, db, firebase } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Router from 'next/router';
import { doc, DocumentData, onSnapshot } from 'firebase/firestore';

type Auth = {
  user: FirebaseUser | null | undefined;
  userData: DocumentData | undefined;
  userPath: string;
  getUser: () => FirebaseUser | null;
  login: (
    email: string,
    password: string,
  ) => Promise<UserCredential | undefined>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<UserCredential | undefined>;
  loading: boolean;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<Auth>({
  user: null,
  userData: undefined,
  userPath: '',
  getUser: () => null,
  login: async () => undefined,
  changePassword: async () => undefined,
  deleteAccount: async () => undefined,
  logout: async () => {},
  signUp: async () => undefined,
  loading: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  // const [user, setUser] = useState<FirebaseUser | null | undefined>();
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<DocumentData | undefined>(undefined);
  const [userPath, setUserPath] = useState<string>('');
  // const [loading, setLoading] = useState<boolean>(true);

  async function login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    Router.push('home');
    return cred;
  }

  async function changePassword(oldPassword: string, newPassword: string) {
    if (user && user.email) {
      const cred = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
    }
  }

  async function deleteAccount(password: string) {
    if (user && user.email) {
      const cred = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, cred);
      deleteUser(user).then(() => {
        Router.push('/');
      });
    }
  }

  async function logout() {
    signOut(auth).then(() => {
      Router.push('/');
    });
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
        setUserPath(ref.path);
        const token = await user.getIdToken();
        nookies.set(undefined, 'token', token, {});
        unsubscribe = onSnapshot(ref, (doc) => {
          setUserData(doc.data());
        });
        // setLoading(false);
      } else {
        setUserData(undefined);
        nookies.set(undefined, 'token', '', {});
      }
    }
    fetchData();

    return unsubscribe;
  }, [user]);

  const value: Auth = {
    user,
    userData,
    userPath,
    getUser,
    login,
    changePassword,
    deleteAccount,
    logout,
    signUp,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
