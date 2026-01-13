import cn from 'clsx'
import { Button } from 'components/button'
import { Link } from 'components/link'
import dynamic from 'next/dynamic'
import s from './footer.module.scss'

const GitHub = dynamic(() => import('icons/github.svg'), { ssr: false })

export function Footer({ theme = 'light' }) {
  return (
    <footer className={cn(`theme-${theme}`, s.footer)}>
      <div className={cn(s.top, 'layout-grid hide-on-mobile')}>
        <p className={cn(s['first-line'], 'h1 vh')}>
          Lenis is <br />
          <span className="contrast">Open source</span>
        </p>

        <p className={cn(s['last-line'], 'h1 vh')}>
          open to <span className="hide-on-desktop">&nbsp;</span> features{' '}
          <br /> and sponsors
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
      <div className={cn(s.top, 'layout-block hide-on-desktop')}>
        <p className={cn(s['first-line'], 'h1')}>
          Lenis is <br />
          <span className="contrast">Open source</span>
        </p>
        <p className={cn(s['last-line'], 'h1')}>
          open to features <br /> and sponsors
        </p>
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
        <Button
          className={cn(s.cta, 'hide-on-desktop')}
          icon={<GitHub />}
          href="https://github.com/sponsors/darkroomengineering"
        >
          Let's build together
        </Button>
      </div>
    </footer>
  )
}
