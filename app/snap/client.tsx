'use client'

import cn from 'clsx'
import Lenis from 'lenis'
import Snap from 'lenis/snap'
import { useEffect, useRef } from 'react'
import s from './snap.module.css'

export default function SnapClient() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const lenis = new Lenis({
      prevent: (node) => node.nodeName === 'VERCEL-LIVE-FEEDBACK',
    })
    ;(window as Window & { lenis?: Lenis }).lenis = lenis

    const snap = new Snap(lenis, {
      type: 'mandatory',
      // @ts-expect-error - velocityThreshold exists in the implementation but not in types
      velocityThreshold: 1,
      onSnapStart: (_snap) => {
        // Snap start callback - can be used for animations
      },
      onSnapComplete: (_snap) => {
        // Snap complete callback - can be used for state updates
      },
    })
    ;(window as Window & { snap?: Snap }).snap = snap

    const section1 = sectionRefs.current[0]
    const section2 = sectionRefs.current[1]
    const section3 = sectionRefs.current[2]
    const section4 = sectionRefs.current[3]

    if (section1) {
      snap.addElement(section1, {
        align: ['start', 'end'],
      })
    }

    if (section2) {
      snap.addElement(section2, {
        align: 'center',
      })
    }

    if (section3) {
      snap.addElement(section3, {
        align: 'center',
      })
    }

    if (section4) {
      snap.addElement(section4, {
        align: ['start', 'end'],
      })
    }

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className={s.page}>
      {Array.from({ length: 4 }).map((_, index) => (
        <section
          key={index}
          className={cn(s.section, s[`section-${index + 1}`])}
          ref={(node) => {
            sectionRefs.current[index] = node
          }}
        >
          <div className={s.inner} />
        </section>
      ))}
    </div>
  )
}
