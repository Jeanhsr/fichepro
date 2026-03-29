import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'
import PremiumEffects from '../components/PremiumEffects'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <PremiumEffects />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
