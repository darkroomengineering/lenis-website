import cn from 'clsx'
import NextImage, { type ImageProps } from 'next/image'
import s from './image.module.css'

export function Image({
  className,
  ...props
}: { className?: string } & ImageProps) {
  return (
    <NextImage {...props} className={cn(s.image, className)} loading="eager" />
  )
}
