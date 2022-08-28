import Link from 'next/link';
import { ReactElement, ReactNode } from 'react';
import { useAuth } from './useAuth';

type AuthCheckProps = {
  children: JSX.Element | JSX.Element[];
  fallback?: JSX.Element;
};

export function AuthCheck({ children, fallback }: AuthCheckProps) {
  const { user } = useAuth();

  return user ? (
    <>{children}</>
  ) : (
    fallback || <Link href="/">You must be logged in.</Link>
  );
}
