'use client'

// import { Button } from 'components/button'
// import Arrow from 'icons/arrow-buttons.svg'
import cn from 'clsx'
import s from './filters.module.scss'
import { useState, useEffect } from 'react'

const FILTERS = [
  {
    label: 'Infinite',
    value: 'infinite',
  },
  {
    label: 'Snap',
    value: 'snap',
  },
  {
    label: 'Horizontal',
    value: 'horizontal',
  },
  {
    label: 'WebGL',
    value: 'webgl',
  },
  {
    label: 'Template',
    value: 'template',
  },
  {
    label: 'Framer',
    value: 'framer',
  },
  {
    label: 'React',
    value: 'react',
  },
  {
    label: 'Vue',
    value: 'vue',
  },
]

export function Filters({ className, onChange }) {
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
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            className={cn(s.tag, filters.includes(filter.value) && s.active)}
            onClick={() =>
              setFilters((prev) => {
                return prev.includes(filter.value)
                  ? prev.filter((f) => f !== filter.value)
                  : [...prev, filter.value]
              })
            }
          >
            {filter.label}
          </button>
        ))}
      </div>
      {/* </div> */}
    </div>
  )
}
