import cn from 'clsx'
import s from './card.module.scss'
import { Image } from 'components/image'
import { Link } from 'components/link'
import Arrow from 'icons/arrow-diagonal.svg'

export default function ShowcaseCard({
  className,
  title,
  credits,
  image,
  href,
}) {
  return (
    <div className={cn(s.card, className)}>
      <Link className={s.image} href={href}>
        <div className={s.imageInner}>
          <Image src={image} alt={title} fill objectFit="cover" sizes="20vw" />
        </div>
        <div className={s.arrow}>
          <Arrow />
        </div>
      </Link>
      <div className={s.inner}>
        <Link className={cn(s.title, 'p')} href={href}>
          {title}
        </Link>
        <div className={cn('p', s.credits)}>{credits}</div>
        {/* <Link className={cn('p', s.credits)} href={credits?.href}>
          {credits?.text}
        </Link> */}
      </div>
    </div>
  )
}
