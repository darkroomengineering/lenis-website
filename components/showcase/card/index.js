'use client'

import { track } from '@vercel/analytics'
import cn from 'clsx'
import { useState } from 'react'
import { Image } from '@/components/image'
import { Link } from '@/components/link'
import Arrow from '@/icons/arrow-diagonal.svg'
import s from './card.module.css'

export default function ShowcaseCard({
  className,
  title,
  featured,
  credits,
  thumbnail,
  thumbnailType,
  poster,
  href,
  isSponsor,
  priority,
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      className={cn(
        s.card,
        hover && s.hover,
        featured && s.featured,
        className
      )}
    >
      <Link
        className={s.image}
        href={href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          track('showcase_card_click', { href })
        }}
        aria-label={title}
      >
        <div className={s.imageInner}>
          {thumbnailType === 'image' ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              sizes={`(max-width: 800px) 100vw, ${priority ? '66vw' : '33vw'}`}
              priority={priority}
            />
          ) : (
            <video
              src={thumbnail}
              poster={poster}
              autoPlay
              muted
              loop
              className={s.video}
            />
          )}
        </div>
        {isSponsor && <div className={cn('p-xs', s.sponsor)}>Sponsored</div>}
        <div className={s.arrow}>
          <Arrow className={cn('icon')} />
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
