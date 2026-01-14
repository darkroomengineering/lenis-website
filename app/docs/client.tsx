'use client'

import Lenis from 'lenis'
import { useEffect, useRef, useState } from 'react'
import s from './docs.module.css'

export default function DocsClient() {
  // Custom useFrame for RAF timing
  const useFrame = (callback: (time: number) => void, _priority = 0) => {
    const savedCallback = useRef(callback)

    useEffect(() => {
      savedCallback.current = callback
    }, [callback])

    useEffect(() => {
      let rafId: number

      function tick(time: number) {
        savedCallback.current(time)
        rafId = requestAnimationFrame(tick)
      }

      rafId = requestAnimationFrame(tick)

      return () => {
        if (rafId) cancelAnimationFrame(rafId)
      }
    }, [])
  }
  const [rootLenis, setRootLenis] = useState<Lenis>()
  const [lenis, setLenis] = useState<Lenis>()

  useEffect(() => {
    const lenis = new Lenis({})
    setRootLenis(lenis)

    return () => {
      setRootLenis(undefined)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      wrapper: document.querySelector('#wrapper') as HTMLElement,
      content: document.querySelector('#content') as HTMLElement,
    })
    setLenis(lenis)

    ;(window as Window & { lenis?: Lenis }).lenis = lenis

    return () => {
      setLenis(undefined)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    // Subscribe to scroll events (handler left empty for debugging)
    rootLenis?.on('scroll', () => {
      // Scroll event handler - can be used for debugging
    })
  }, [rootLenis])

  useFrame((time) => {
    rootLenis?.raf(time)
    lenis?.raf(time)
  })

  const contentRef = useRef<HTMLParagraphElement>(null)

  return (
    <div className={s.page}>
      <div id="wrapper" className={s.wrapper}>
        <p id="content" className={s.content} ref={contentRef}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure autem
          accusantium similique quod accusamus ipsum saepe consequuntur,
          delectus voluptatum quibusdam laboriosam labore eos ab necessitatibus,
          sit hic ad dignissimos soluta. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Iure autem accusantium similique quod accusamus
          ipsum saepe consequuntur, delectus voluptatum quibusdam laboriosam
          labore eos ab necessitatibus, sit hic ad dignissimos soluta. Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Iure autem
          accusantium similique quod accusamus ipsum saepe consequuntur,
          delectus voluptatum quibusdam laboriosam labore eos ab necessitatibus,
          sit hic ad dignissimos soluta. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Iure autem accusantium similique quod accusamus
          ipsum saepe consequuntur, delectus voluptatum quibusdam laboriosam
          labore eos ab necessitatibus, sit hic ad dignissimos soluta. Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Iure autem
          accusantium similique quod accusamus ipsum saepe consequuntur,
          delectus voluptatum quibusdam laboriosam labore eos ab necessitatibus,
          sit hic ad dignissimos soluta. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Iure autem accusantium similique quod accusamus
          ipsum saepe consequuntur, delectus voluptatum quibusdam laboriosam
          labore eos ab necessitatibus, sit hic ad dignissimos soluta.
        </p>
      </div>
    </div>
  )
}
