import { createContext, useContext, useEffect, useState } from 'react';
// import { auth } from './firebaseInit'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import nookies from 'nookies';
import { auth } from './firebase';
import { async } from '@firebase/util';

type Auth = {
  user: FirebaseUser | null | undefined;
  getUser: () => FirebaseUser | null;
  login: (
    email: string,
    password: string,
  ) => Promise<UserCredential | undefined>;
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

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
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
      const token = await user.getIdToken();
      nookies.set(undefined, 'token', token, {});

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: Auth = {
    user,
    getUser,
    login,
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
