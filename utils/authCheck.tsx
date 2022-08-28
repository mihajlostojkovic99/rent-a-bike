import Link from 'next/link';
import { ReactElement, ReactNode } from 'react';
import { useAuth } from './useAuth';

type AuthCheckProps = {
  children: JSX.Element;
  fallback?: JSX.Element;
};

const AuthCheck = ({ children, fallback }: AuthCheckProps) => {
  const { userData } = useAuth();

  return userData
    ? children
    : fallback || <Link href="/">You must be logged in.</Link>;
};

export default AuthCheck;
