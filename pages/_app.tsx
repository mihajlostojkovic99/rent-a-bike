import '../styles/globals.css';
import '../styles/navbar.scss';
import '../styles/searchbox.scss';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
