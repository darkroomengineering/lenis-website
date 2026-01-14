import cn from 'clsx'
import { useMediaQuery } from 'hamo'
import { useMemo, useState } from 'react'
import s from './grid-debugger.module.css'

export const GridDebugger = () => {
  const [visible, setVisible] = useState(false)
  const _isMobile = useMediaQuery('(max-width: 799.98px)')

  const columns = useMemo(() => {
    return Number.parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--layout-columns-count'
      ),
      10
    )
  }, [])

  return (
    <div className={s.grid}>
      <button
        type="button"
        onClick={() => {
          setVisible(!visible)
        }}
      >
        🌐
      </button>
      {visible && (
        <div className={cn('dr-layout-grid', s.debugger)}>
          {new Array(columns).fill(0).map((_, idx) => (
            <span key={`col-${idx}`} />
          ))}
        </div>
      )}
    </div>
  )
}
