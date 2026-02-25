'use client'

import { track } from '@vercel/analytics'
// import { Button } from '@/components/button'
// import Arrow from '@/icons/arrow-diagonal.svg'
import cn from 'clsx'
import { useEffect, useImperativeHandle, useState } from 'react'
import { useDebounce } from 'use-debounce'
import Cross from '@/icons/cross.svg'
import Magnifier from '@/icons/magnifier.svg'
import s from './filters.module.css'

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {Function} [props.onChange]
 * @param {Function} [props.onSearch]
 * @param {string[]} [props.list]
 * @param {Record<string, number>} [props.counts]
 * @param {number} [props.total]
 * @param {string[]} [props.defaultFilters]
 * @param {string} [props.id]
 * @param {React.Ref} [props.ref]
 */
export function Filters({
  className,
  onChange,
  onSearch,
  list = [],
  counts = {},
  total,
  defaultFilters,
  id,
  ref,
}) {
  const [filters, setFilters] = useState(defaultFilters ?? [])
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)

  useEffect(() => {
    onSearch?.(debouncedSearch)
  }, [debouncedSearch, onSearch])

  useEffect(() => {
    onChange?.(filters)
  }, [filters, onChange])

  useImperativeHandle(ref, () => ({
    setFilters: (filters) => {
      setFilters(filters)
    },
    setSearch: (search) => {
      setSearch(search)
    },
  }))

  return (
    <div id={id} className={cn('dr-layout-grid', s.filters, className)}>
      {/* <div className={s.left}> */}
      <div className={cn(s.search, 'p')}>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search ? (
          <button
            type="button"
            className={cn(s.close)}
            onClick={() => setSearch('')}
          >
            <Cross />
          </button>
        ) : (
          <Magnifier className={cn('icon', s.magnifier)} />
        )}
      </div>
      <div className={cn(s.tags, 'p')}>
        <button
          type="button"
          className={cn(
            s.tag,
            filters.length === 0 && s.active,
            'dr-gap-4 flex items-center'
          )}
          onClick={() => setFilters([])}
        >
          <span>All</span>
          {total != null && (
            <div
              className={cn(
                'dr-w-16 dr-h-16 dr-text-8 flex aspect-square shrink-0 items-center justify-center rounded-full bg-contrast text-center text-primary',
                filters.length === 0 && 'bg-primary! text-secondary!'
              )}
            >
              {total}
            </div>
          )}
        </button>
        {list.map((filter) => (
          <button
            type="button"
            key={filter}
            className={cn(
              s.tag,
              filters.includes(filter) && s.active,
              'dr-gap-8 flex items-center text-nowrap'
            )}
            onClick={() => {
              track('showcase_filter_click', { filter })

              setFilters((prev) => {
                return prev.includes(filter)
                  ? prev.filter((f) => f !== filter)
                  : [...prev, filter]
              })
            }}
          >
            <span>{filter}</span>

            {/* {counts[filter] != null ? (
              <div
                className={cn(
                  'dr-w-16 dr-h-16 dr-text-8 flex aspect-square shrink-0 items-center justify-center rounded-full border border-contrast bg-contrast text-center text-primary',
                  filters.includes(filter) && 'bg-secondary! text-contrast'
                )}
              >
                {counts[filter]}
              </div>
            ) : null} */}
          </button>
        ))}
      </div>
      {/* </div> */}
    </div>
  )
}
