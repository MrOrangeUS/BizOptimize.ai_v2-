import '../styles/globals.css';
import AlienCursor from '../components/AlienCursor';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AlienCursor />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
