import cn from 'clsx'
import s from './card.module.scss'
import { Image } from 'components/image'
import { Link } from 'components/link'
import Arrow from 'icons/arrow-diagonal.svg'
import { useState } from 'react'

export default function ShowcaseCard({
  className,
  title,
  credits,
  image,
  href,
  priority,
}) {
  const [hover, setHover] = useState(false)

  return (
    <div className={cn(s.card, hover && s.hover, className)}>
      <Link
        className={s.image}
        href={href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={s.imageInner}>
          <Image
            src={image}
            alt={title}
            fill
            objectFit="cover"
            sizes={`(max-width: 800px) 100vw, ${priority ? '66vw' : '33vw'}`}
            priority={priority}
          />
        </div>
        <div className={s.arrow}>
          <Arrow />
        </div>
      </Link>
      <div className={s.inner}>
        <Link
          className={cn(s.title, 'p')}
          href={href}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {title}
        </Link>
        <div className={cn('p', s.credits)}>{credits}</div>
      </div>
    </div>
  )
}
