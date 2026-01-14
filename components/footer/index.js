import cn from 'clsx'
import dynamic from 'next/dynamic'
import { Button } from '@/components/button'
import { Link } from '@/components/link'
import s from './footer.module.css'

const GitHub = dynamic(() => import('@/icons/github.svg'), { ssr: false })

export function Footer({ theme = 'light' }) {
  return (
    <footer className={s.footer} data-theme={theme}>
      <div className={cn(s.top, 'dr-layout-grid desktop-only')}>
        <p className={cn(s['first-line'], 'h1 vh')}>
          Lenis is <br />
          <span className="contrast">Open source</span>
        </p>

        <p className={cn(s['last-line'], 'h1 vh')}>
          open to <span className="mobile-only">&nbsp;</span> features <br />{' '}
          and sponsors
        </p>
        <Button
          className={s.cta}
          arrow
          icon={<GitHub />}
          href="https://github.com/sponsors/darkroomengineering"
        >
          Let's build together
        </Button>
      </div>
      <div className={cn(s.top, 'dr-layout-block mobile-only')}>
        <p className={cn(s['first-line'], 'h1')}>
          Lenis is <br />
          <span className="contrast">Open source</span>
        </p>
        <p className={cn(s['last-line'], 'h1')}>
          open to features <br /> and sponsors
        </p>
        <Button
          className={s.cta}
          icon={<GitHub />}
          href="https://github.com/sponsors/darkroomengineering"
        >
          Let's build together
        </Button>
      </div>
      <div className={s.bottom}>
        <div className={s.links}>
          <Link
            className={cn(s.link, 'link p-xs')}
            href="https://twitter.com/LenisSmooth"
          >
            X
          </Link>
          <Link
            className={cn(s.link, 'link p-xs')}
            href="https://github.com/darkroomengineering/lenis"
          >
            GitHub
          </Link>
          <Link
            className={cn(s.link, 'link p-xs')}
            href="mailto:hi@darkroom.engineering"
          >
            Mail
          </Link>
          <Link
            className={cn(s.link, 'link p-xs')}
            href="https://darkroom.engineering/"
          >
            darkroom.engineering
          </Link>
        </div>
        <p className={cn('p-xs', s.tm)}>
          <span>©</span> {new Date().getFullYear()} darkroom.engineering
        </p>
      </div>
    </footer>
  )
}
