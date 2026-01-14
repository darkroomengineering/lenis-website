import cn from 'clsx'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Link } from '@/components/link'
import { useStore } from '@/lib/store'
import s from './navigation.module.css'

export const Navigation = () => {
  const { navIsOpen, setNavIsOpen } = useStore(
    useShallow((state) => ({
      navIsOpen: state.navIsOpen,
      setNavIsOpen: state.setNavIsOpen,
    }))
  )

  const router = useRouter()

  useEffect(() => {
    const onRouteChange = () => {
      setNavIsOpen(false)
    }

    router.events.on('routeChangeStart', onRouteChange)

    return () => {
      router.events.off('routeChangeStart', onRouteChange)
    }
  }, [router.events.off, router.events.on, setNavIsOpen])

  return (
    <div className={cn(s.navigation, !navIsOpen && s.closed)}>
      <Link href="/">home</Link>
      <Link href="/gsap">gsap</Link>
      <Link href="/contact">contact</Link>
    </div>
  )
}
