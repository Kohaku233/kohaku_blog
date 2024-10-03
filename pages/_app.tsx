import '@/app/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return (
    <>
      {isLoading && <div>加载中...</div>}
      <Component {...pageProps} />
    </>
  )
}