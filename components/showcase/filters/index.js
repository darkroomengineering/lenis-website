// import { Button } from 'components/button'
// import Arrow from 'icons/arrow-buttons.svg'
import cn from 'clsx'
import s from './filters.module.scss'

export function Filters({ className }) {
  return (
    <div className={cn('layout-grid', s.filters, className)}>
      <div className={s.left}>
        <input type="text" placeholder="Search" className={cn(s.search, 'p')} />
        <div className={cn(s.tags, 'p')}>
          <span className={cn(s.tag, s.active)}>All</span>
          <span className={s.tag}>Infinite</span>
          <span className={s.tag}>Snap</span>
          <span className={s.tag}>Horizontal</span>
          <span className={s.tag}>WebGL</span>
          <span className={s.tag}>Framer</span>
          <span className={s.tag}>React</span>
          <span className={s.tag}>Vue</span>
        </div>
      </div>
    </div>
  )
}
