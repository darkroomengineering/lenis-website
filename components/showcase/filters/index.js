'use client'

// import { Button } from 'components/button'
// import Arrow from 'icons/arrow-buttons.svg'
import cn from 'clsx'
import s from './filters.module.scss'
import { useState, useEffect } from 'react'

export function Filters({ className, onChange, list = [] }) {
  const [filters, setFilters] = useState([])

  useEffect(() => {
    onChange?.(filters)
  }, [filters])

  return (
    <div className={cn('layout-grid', s.filters, className)}>
      {/* <div className={s.left}> */}
      <input type="text" placeholder="Search" className={cn(s.search, 'p')} />
      <div className={cn(s.tags, 'p')}>
        <button
          className={cn(s.tag, filters.length === 0 && s.active)}
          onClick={() => setFilters([])}
        >
          All
        </button>
        {list.map((filter) => (
          <button
            key={filter}
            className={cn(s.tag, filters.includes(filter) && s.active)}
            onClick={() =>
              setFilters((prev) => {
                return prev.includes(filter)
                  ? prev.filter((f) => f !== filter)
                  : [...prev, filter]
              })
            }
          >
            {filter}
          </button>
        ))}
      </div>
      {/* </div> */}
    </div>
  )
}
