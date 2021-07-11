import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import LinearProgress from '@material-ui/core/LinearProgress'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const ok = () => setLoading(false);
    const load = () => setLoading(true);

    router.events.on("routeChangeStart", load);
    router.events.on('routeChangeComplete', ok);
    router.events.on('routeChangeError', ok);

  }, [router])

  return (
    <>
      {loading && <LinearProgress className="global-loading-bar" color="secondary" />}
      <Component {...pageProps} />
    </>
  )
}
export default MyApp
