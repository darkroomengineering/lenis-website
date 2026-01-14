import cn from 'clsx'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Button } from '@/components/button'
import { useStore } from '@/lib/store'
import s from './modal.module.css'

const HeartSVG = dynamic(() => import('@/icons/sponsor.svg'), { ssr: false })

export function Modal() {
  const [active, setActive] = useState(false)

  const lenis = useStore(({ lenis }) => lenis)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActive(true)
    }, 10000)

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!lenis) return

    if (active) {
      lenis.stop()
    } else {
      lenis.start()
    }
  }, [active, lenis])

  const handleClose = () => setActive(false)

  return (
    <div
      className={cn(s.modal, 'dr-layout-grid-inner', active && s.active)}
      data-theme="light"
      onClick={handleClose}
      onKeyDown={(e) => e.key === 'Escape' && handleClose()}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        className={s.content}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
      >
        <button
          type="button"
          className={s.close}
          onClick={() => setActive(false)}
        />
        <div className={cn(s.text, 'p')}>
          <p>
            Lenis is 100% free, open-source, and built to make the web feel
            smoother. 🚀
          </p>
          <br />
          <p>
            Maintaining a high-quality library takes time and effort. If Lenis
            has helped your workflow, consider supporting our journey by
            becoming a sponsor! 💙
          </p>
          <br />
          <p>Huge thanks to our community for keeping this project alive! 🙌</p>
        </div>
        <Button
          className={cn(s.cta)}
          arrow
          icon={<HeartSVG className={cn('icon')} />}
          href="https://github.com/sponsors/darkroomengineering"
        >
          become a sponsor
        </Button>
      </div>
    </div>
  )
}
