import cn from 'clsx'
import NextImage from 'next/image'
import s from './image.module.css'

export function Image({ className, ...props }) {
  return (
    <NextImage {...props} className={cn(s.image, className)} loading="eager" />
  )
}
