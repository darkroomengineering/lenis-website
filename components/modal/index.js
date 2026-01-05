import { Button } from 'components/button'
import s from './modal.module.scss'
import cn from 'clsx'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useStore } from 'lib/store'

const HeartSVG = dynamic(() => import('icons/sponsor.svg'), { ssr: false })

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
  }, [active])

  return (
    <div
      className={cn(
        s.modal,
        'layout-grid-inner theme-light',
        active && s.active
      )}
      onClick={() => setActive(false)}
    >
      <div className={s.content} onClick={(e) => e.stopPropagation()}>
        <button className={s.close} onClick={() => setActive(false)}></button>
        <div className={cn(s.text, 'p')}>
          <p>
            Lenis is a 100% free and open-source project, built to enhance web
            experiences. 🚀
            <br />
            But maintaining and improving Lenis takes time and resources.
          </p>
          <br />
          <p>
            If you use Lenis and want to support its development, consider
            becoming a sponsor! 💙
            <br />A huge thank you to everyone who helps keep Lenis alive! 🙌
          </p>
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
