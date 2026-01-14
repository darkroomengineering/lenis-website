'use client'

import { useMediaQuery } from 'hamo'
import { useEffect, useState } from 'react'
import { breakpoints } from '@/lib/styles/config'

/**
 * Hook for detecting device capabilities and characteristics.
 *
 * Provides comprehensive device detection including screen size, input methods,
 * performance preferences, and browser capabilities.
 *
 * @example
 * ```tsx
 * const { isMobile, isDesktop, isReducedMotion, isWebGL } = useDeviceDetection()
 *
 * if (isReducedMotion) {
 *   // Disable animations
 * }
 *
 * return isMobile ? <MobileLayout /> : <DesktopLayout />
 * ```
 */
export function useDeviceDetection() {
  const breakpoint = breakpoints.dt

  const isMobile = useMediaQuery(`(max-width: ${breakpoint - 1}px)`)
  const isDesktop = useMediaQuery(`(min-width: ${breakpoint}px)`)
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isWebGL = isDesktop
  const [dpr, setDpr] = useState<number | undefined>(undefined)
  const [isSafari, setIsSafari] = useState<boolean | undefined>(undefined)
  const [isTouch, setIsTouch] = useState<boolean | undefined>(undefined)

  // Check for low power mode / touch device
  const isLowPowerMode = useMediaQuery(
    '(any-pointer: coarse) and (hover: none)'
  )

  useEffect(() => {
    setDpr(window.devicePixelRatio)
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return {
    isMobile,
    isDesktop,
    isReducedMotion,
    isWebGL,
    isLowPowerMode,
    isTouch,
    dpr,
    isSafari,
  }
}
