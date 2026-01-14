import s from './header.module.css'

export function Header({ ref }) {
  return (
    <header className={s.header} ref={ref}>
      <p className="dr-layout-block">hi</p>
    </header>
  )
}
