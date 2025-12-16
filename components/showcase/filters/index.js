'use client'

// import { Button } from 'components/button'
// import Arrow from 'icons/arrow-buttons.svg'
import cn from 'clsx'
import s from './filters.module.scss'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDebounce } from 'use-debounce'

export const Filters = forwardRef(function Filters(
  { className, onChange, onSearch, list = [], id },
  ref
) {
  const [filters, setFilters] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)

  useEffect(() => {
    onSearch?.(debouncedSearch)
  }, [debouncedSearch])

  useEffect(() => {
    onChange?.(filters)
  }, [filters])

  useImperativeHandle(ref, () => ({
    setFilters: (filters) => {
      setFilters(filters)
    },
    setSearch: (search) => {
      setSearch(search)
    },
  }))

  return (
    <div id={id} className={cn('layout-grid', s.filters, className)}>
      {/* <div className={s.left}> */}
      <input
        type="text"
        placeholder="Search"
        className={cn(s.search, 'p')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
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
})
