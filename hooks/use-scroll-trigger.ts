'use client'

import type { Rect } from 'hamo'
import { useLazyState, useWindowSize } from 'hamo'
import { useLenis } from 'lenis/react'
import { useCallback, useEffect, useRef } from 'react'
import { clamp, mapRange } from '@/lib/maths'

type TriggerPosition = 'top' | 'center' | 'bottom' | number
type TriggerPositionCombination = `${TriggerPosition} ${TriggerPosition}`

export interface UseScrollTriggerOptions {
  rect?: Rect
  start?: TriggerPositionCombination
  end?: TriggerPositionCombination
  offset?: number
  disabled?: boolean
  onEnter?: (data: { progress: number }) => void
  onLeave?: (data: { progress: number }) => void
  onProgress?: (data: {
    progress: number
    isActive: boolean
    height: number
  }) => void
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' || !Number.isNaN(Number(value))
}

/**
 * Hook for creating scroll-based animations and triggers.
 *
 * @example
 * ```tsx
 * import { useScrollTrigger } from '@/hooks/use-scroll-trigger'
 * import { useRect } from 'hamo'
 *
 * function AnimatedSection() {
 *   const [setRectRef, rect] = useRect()
 *
 *   useScrollTrigger({
 *     rect,
 *     start: 'bottom bottom',  // Start when element bottom hits viewport bottom
 *     end: 'top top',          // End when element top hits viewport top
 *     onProgress: ({ progress }) => {
 *       element.style.opacity = String(progress)
 *     }
 *   })
 *
 *   return <div ref={setRectRef}>Animated content</div>
 * }
 * ```
 */
export function useScrollTrigger({
  rect,
  start = 'bottom bottom',
  end = 'top top',
  offset = 0,
  disabled = false,
  onEnter,
  onLeave,
  onProgress,
}: UseScrollTriggerOptions) {
  const lenis = useLenis()
  const { height: windowHeight = 0 } = useWindowSize()

  // Store callbacks in refs to avoid effect re-runs
  const onEnterRef = useRef(onEnter)
  const onLeaveRef = useRef(onLeave)
  const onProgressRef = useRef(onProgress)

  useEffect(() => {
    onEnterRef.current = onEnter
    onLeaveRef.current = onLeave
    onProgressRef.current = onProgress
  }, [onEnter, onLeave, onProgress])

  const isReady = rect?.top !== undefined

  // Parse position strings
  const [elementStartKeyword, viewportStartKeyword] = start.split(' ')
  const [elementEndKeyword, viewportEndKeyword] = end.split(' ')

  let viewportStart = isNumber(viewportStartKeyword)
    ? Number.parseFloat(viewportStartKeyword)
    : 0
  if (viewportStartKeyword === 'top') viewportStart = 0
  if (viewportStartKeyword === 'center') viewportStart = windowHeight * 0.5
  if (viewportStartKeyword === 'bottom') viewportStart = windowHeight

  let viewportEnd = isNumber(viewportEndKeyword)
    ? Number.parseFloat(viewportEndKeyword)
    : 0
  if (viewportEndKeyword === 'top') viewportEnd = 0
  if (viewportEndKeyword === 'center') viewportEnd = windowHeight * 0.5
  if (viewportEndKeyword === 'bottom') viewportEnd = windowHeight

  let elementStart = isNumber(elementStartKeyword)
    ? Number.parseFloat(elementStartKeyword)
    : rect?.bottom || 0
  if (elementStartKeyword === 'top') elementStart = rect?.top || 0
  if (elementStartKeyword === 'center')
    elementStart = (rect?.top || 0) + (rect?.height || 0) * 0.5
  if (elementStartKeyword === 'bottom') elementStart = rect?.bottom || 0

  elementStart += offset

  let elementEnd = isNumber(elementEndKeyword)
    ? Number.parseFloat(elementEndKeyword)
    : rect?.top || 0
  if (elementEndKeyword === 'top') elementEnd = rect?.top || 0
  if (elementEndKeyword === 'center')
    elementEnd = (rect?.top || 0) + (rect?.height || 0) * 0.5
  if (elementEndKeyword === 'bottom') elementEnd = rect?.bottom || 0

  elementEnd += offset

  const startValue = elementStart - viewportStart
  const endValue = elementEnd - viewportEnd

  const [setProgress] = useLazyState<number>(
    Number.NaN,
    (progress: number, lastProgress: number | undefined) => {
      if (Number.isNaN(progress) || progress === undefined) return
      if (lastProgress === undefined) return

      // Enter
      if (
        (progress >= 0 && lastProgress < 0) ||
        (progress <= 1 && lastProgress > 1)
      ) {
        onEnterRef.current?.({ progress: clamp(0, progress, 1) })
      }

      // Progress
      if (clamp(0, progress, 1) !== clamp(0, lastProgress, 1)) {
        onProgressRef.current?.({
          progress: clamp(0, progress, 1),
          isActive: progress >= 0 && progress <= 1,
          height: endValue - startValue,
        })
      }

      // Leave
      if (
        (progress < 0 && lastProgress >= 0) ||
        (progress > 1 && lastProgress <= 1)
      ) {
        onLeaveRef.current?.({ progress: clamp(0, progress, 1) })
      }
    },
    [endValue, startValue]
  )

  const update = useCallback(() => {
    if (disabled) return
    if (!isReady) return

    const scroll = lenis ? Math.floor(lenis.scroll) : window.scrollY
    const progress = mapRange(startValue, endValue, scroll, 0, 1)

    setProgress(progress)
  }, [disabled, isReady, lenis, startValue, endValue, setProgress])

  useLenis(update)

  useEffect(() => {
    if (lenis) return

    update()
    window.addEventListener('scroll', update, false)

    return () => {
      window.removeEventListener('scroll', update, false)
    }
  }, [lenis, update])
}
