'use client'

import cn from 'clsx'
import dynamic from 'next/dynamic'
import { Link } from '@/components/link'
import s from './button.module.css'

const Arrow = dynamic(() => import('@/icons/arrow-diagonal.svg'), {
  ssr: false,
})

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.icon]
 * @param {boolean} [props.arrow]
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.href]
 * @param {Function} [props.onClick]
 * @param {string} [props.className]
 * @param {React.CSSProperties} [props.style]
 */
export const Button = ({
  icon,
  arrow,
  children,
  href,
  onClick,
  className,
  style,
}) => {
  return href ? (
    <Link
      href={href}
      className={cn(s.button, className, icon && s['has-icon'])}
      style={style}
    >
      {icon && <span className={s.icon}>{icon}</span>}
      <span className={s.text}>
        <span className={s.visible}>
          {children} {arrow && <Arrow className={cn(s.arrow, 'icon')} />}
        </span>
        <span aria-hidden="true" className={s.hidden}>
          {children} {arrow && <Arrow className={cn(s.arrow, 'icon')} />}
        </span>
      </span>
    </Link>
  ) : (
    <button
      type="button"
      className={cn(s.button, className, icon && s['has-icon'])}
      style={style}
      onClick={onClick}
    >
      {icon && <span className={s.icon}>{icon}</span>}
      <span className={s.text}>
        <span className={s.visible}>
          {children} {arrow && <Arrow className={cn(s.arrow, 'icon')} />}
        </span>
        <span aria-hidden="true" className={s.hidden}>
          {children} {arrow && <Arrow className={cn(s.arrow, 'icon')} />}
        </span>
      </span>
    </button>
  )
}
