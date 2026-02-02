'use client'

import cn from 'clsx'
import { ReactLenis, useLenis } from 'lenis/react'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { Button } from '@/components/button'
import { Footer } from '@/components/footer'
import { Link } from '@/components/link'
import ShowcaseCard from '@/components/showcase/card'
import { Filters } from '@/components/showcase/filters'
import Arrow from '@/icons/arrow-diagonal.svg'
import CubeSVG from '@/icons/cube.svg'
import LenisSVG from '@/icons/l.svg'
import { RichText } from '@/lib/notion'
import s from './showcase.module.css'

// @refresh reset

const WebGL = dynamic(
  () => import('@/components/webgl').then(({ WebGL }) => WebGL),
  { ssr: false }
)

function getThumbnailType(title: string) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg']
  const videoExtensions = ['mp4', 'webm', 'mov']

  if (imageExtensions.includes(title.split('.').pop() || '')) {
    return 'image'
  }
  if (videoExtensions.includes(title.split('.').pop() || '')) {
    return 'video'
  }
  return null
}

interface ShowcaseClientProps {
  database: {
    results: Array<{
      created_time: string
      properties: {
        title: {
          rich_text: Array<{ plain_text: string }>
        }
        url: {
          url: string
        }
        thumbnail: {
          files?: Array<{
            file?: { url: string }
            name: string
          }>
        }
        credits: {
          rich_text: unknown[]
        }
        technologies: {
          multi_select: Array<{ name: string }>
        }
        features: {
          multi_select: Array<{ name: string }>
        }
        publishedAt: {
          date: {
            start: string
          }
        }
      }
      resolvedMedia?: {
        url: string
        type: 'image' | 'video'
        poster?: string
        playbackId?: string
      } | null
    }>
  }
}

export default function ShowcaseClient({ database }: ShowcaseClientProps) {
  const filtersRef = useRef<{
    setFilters: (f: string[]) => void
    setSearch: (s: string) => void
  } | null>(null)

  const [filters, setFilters] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const list = database.results
    // .sort((a, b) => {
    //   return (
    //     new Date(b.created_time).getTime() - new Date(a.created_time).getTime()
    //   )
    // })
    .map((result) => ({
      title: result.properties.title.rich_text[0]?.plain_text ?? '',
      href: (() => {
        const url = result.properties.url.url ?? ''
        if (url.includes('?aff=')) return url
        const baseUrl = url.startsWith('http') ? url : `https://${url}`
        const separator = baseUrl.includes('?') ? '&' : '?'
        return `${baseUrl}${separator}utm_source=lenis.dev`
      })(),
      // Use resolved media URL, fallback to original Notion URL
      thumbnail:
        result.resolvedMedia?.url ??
        result.properties.thumbnail.files?.[0]?.file?.url,
      thumbnailType:
        result.resolvedMedia?.type ??
        getThumbnailType(result.properties.thumbnail.files?.[0]?.name ?? ''),
      poster: result.resolvedMedia?.poster,
      playbackId: result.resolvedMedia?.playbackId,
      credits: RichText({
        richText: result.properties.credits.rich_text as unknown[],
      }),
      creditsRaw: result.properties.credits.rich_text,
      technologies: result.properties.technologies.multi_select.map(
        (tag) => tag.name
      ),
      features: result.properties.features.multi_select.map((tag) => tag.name),
      publishedAt:
        result.properties.publishedAt.date?.start ?? result.created_time,
    }))
    .sort((a, b) => {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    })

  const allFilters = list.flatMap((item) => [
    ...item.technologies,
    ...item.features,
  ])
  const filterCounts = allFilters.reduce<Record<string, number>>(
    (acc, filter) => {
      acc[filter] = (acc[filter] || 0) + 1
      return acc
    },
    {}
  )
  const filtersList = Array.from(new Set(allFilters)).sort(
    (a, b) => (filterCounts[b] ?? 0) - (filterCounts[a] ?? 0)
  )

  const filteredList = list.filter((item) => {
    return (
      filters.every((filter) => {
        return (
          item.technologies.includes(filter) || item.features.includes(filter)
        )
      }) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        JSON.stringify(item.creditsRaw)
          .toLowerCase()
          .includes(search.toLowerCase()))
    )
  })

  const lenis = useLenis()

  return (
    <>
      <ReactLenis root />
      <div className={s.canvas}>
        <WebGL arm={false} />
      </div>
      <div className={s.page} data-theme="dark">
        <div className="relative">
          <Link className={s.logo} href="/">
            <LenisSVG />
          </Link>

          <section className={cn(s.hero, 'dr-layout-block')}>
            <div className={s.tagline}>
              <h1 className={cn('h2', s.title)}>Get smooth or die trying</h1>
              <h2 className={cn('h4', s.subtitle)}>
                A showcase of neat Lenis implementations
              </h2>
            </div>
            <div
              className={cn(
                'dr-layout-grid w-full max-dt:flex max-dt:flex-col',
                s.buttons
              )}
            >
              <Button
                className={cn(s.button, 'col-span-3 col-start-4')}
                icon={<Arrow className={cn('icon')} />}
                href="https://darkroom-engineering.notion.site/2c0e97ae01cf80598f03e5fa862b678e"
              >
                Submit your work
              </Button>
              <Button
                className={cn(s.button, 'col-span-3')}
                icon={<CubeSVG className={cn('icon')} />}
                onClick={() => {
                  filtersRef.current?.setFilters(['Template'])
                  filtersRef.current?.setSearch('')
                  lenis?.scrollTo('#filters')
                }}
              >
                find a template
              </Button>
            </div>
          </section>
          <Filters
            className={s.filters}
            onChange={setFilters}
            onSearch={setSearch}
            list={filtersList}
            id="filters"
            ref={filtersRef}
          />
          <section
            className={cn(
              'dr-layout-grid',
              s.grid,
              (search || filters.length > 0) && s.isFiltered
            )}
          >
            {filteredList.length === 0 ? (
              <div className={s.noResults}>
                <p className="p">No results found</p>
                <Button
                  className={s.button}
                  icon={<Arrow className={cn('icon')} />}
                  href="https://darkroom-engineering.notion.site/2c0e97ae01cf80598f03e5fa862b678e"
                >
                  Submit your work
                </Button>
              </div>
            ) : (
              filteredList.map((card, index) => (
                <ShowcaseCard
                  key={card.title}
                  className={cn(s.card)}
                  {...card}
                  priority={index <= 2}
                />
              ))
            )}
          </section>
          <Footer theme="dark" />
        </div>
      </div>
    </>
  )
}
