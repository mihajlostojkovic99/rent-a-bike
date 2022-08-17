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
import { auth, firebase } from './firebase';
import Router from 'next/router';

type Auth = {
  user: FirebaseUser | null | undefined;
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
  const [user, setUser] = useState<FirebaseUser | null | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  async function login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
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
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, 'token', '', {});
        return;
      }

      setUser(user);
      setLoading(false);
      const token = await user.getIdToken();
      nookies.set(undefined, 'token', token, {});
    });

    return unsubscribe;
  }, []);

  const value: Auth = {
    user,
    getUser,
    login,
    changePassword,
    deleteAccount,
    logout,
    signUp,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
