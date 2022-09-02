import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, ReactNode } from 'react';
import { useAuth } from './useAuth';

type AuthCheckProps = {
  children: JSX.Element | JSX.Element[];
  fallback?: JSX.Element;
};

export function AuthCheck({ children, fallback }: AuthCheckProps) {
  const { user } = useAuth();
  const router = useRouter();

  // if (user === null) {
  //   router.replace('/');
  // }

  return user ? (
    <>{children}</>
  ) : (
    fallback || <Link href="/">You must be logged in.</Link>
  );
}
