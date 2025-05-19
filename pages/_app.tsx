import { SessionProvider } from "next-auth/react"
import '../styles/globals.css'

import type { AppProps } from 'next/app';
import type { Session } from "next-auth";

interface MyAppProps extends AppProps {
  pageProps: {
    session?: Session | null;
    [key: string]: any;
  };
}

export default function App({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
