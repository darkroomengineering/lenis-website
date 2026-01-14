import { useEffect } from 'react'
import { useStore } from '@/lib/store'

export function useScroll(callback, _deps = []) {
  const lenis = useStore(({ lenis }) => lenis)

  useEffect(() => {
    if (!lenis) return
    lenis.on('scroll', callback)
    lenis.emit()

    return () => {
      lenis.off('scroll', callback)
    }
  }, [lenis, callback])
}
