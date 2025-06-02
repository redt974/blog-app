import { SessionProvider } from "next-auth/react"
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css' // ✅ important

import type { AppProps } from 'next/app'
import type { Session } from "next-auth"

import { ToastContainer } from 'react-toastify' // ✅ à ajouter

interface MyAppProps extends AppProps {
  pageProps: {
    session?: Session | null;
    [key: string]: any;
  };
}

export default function App({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {
  return (
    <SessionProvider session={session}>
      <>
        <Component {...pageProps} />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </>
    </SessionProvider>
  )
}
