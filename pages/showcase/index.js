'use client'

import { Client } from '@notionhq/client'
import cn from 'clsx'
import { ReactLenis, useLenis } from 'lenis/react'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { Button } from '@/components/button'
import { CustomHead } from '@/components/custom-head'
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

function getThumbnailType(title) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg']
  const videoExtensions = ['mp4', 'webm', 'mov']

  if (imageExtensions.includes(title.split('.').pop())) {
    return 'image'
  }
  if (videoExtensions.includes(title.split('.').pop())) {
    return 'video'
  }
  return null
}

export async function getStaticProps() {
  // Return empty results if NOTION_TOKEN is not configured
  if (!process.env.NOTION_TOKEN) {
    console.warn('NOTION_TOKEN not configured, returning empty showcase')
    return { props: { database: { results: [] } }, revalidate: 60 }
  }

  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    })
    const database = await notion.dataSources.query({
      data_source_id: '2c0e97ae-01cf-80a8-aa3c-000b46741671',
      filter: {
        property: 'status',
        status: {
          equals: 'Published',
        },
      },
    })
    return { props: { database }, revalidate: 1800 } // revalidate every 30 minutes
  } catch (error) {
    console.error('Failed to fetch showcase data:', error)
    return { props: { database: { results: [] } }, revalidate: 60 }
  }
}

export default function Showcase({ database }) {
  const filtersRef = useRef(null)

  const [filters, setFilters] = useState([])
  const [search, setSearch] = useState('')
  // const list = database.results.map((result) => ({
  //   title: result.properties.title.title[0].plain_text,
  //   credits: result.properties.Credits.rich_text[0].plain_text,
  //   image: result.properties.Image.files[0].file.url,
  //   href: result.properties.Link.url,
  // }))

  // console.log(database.results)
  // return

  const list = database.results
    .sort((a, b) => {
      return new Date(b.created_time) - new Date(a.created_time)
    })
    .map((result) => ({
      title: result.properties.title.rich_text[0].plain_text,
      href:
        (result.properties.url.url.startsWith('http')
          ? result.properties.url.url
          : `https://${result.properties.url.url}`) +
        '?utm_source=lenis.dev/showcase',
      thumbnail: result.properties.thumbnail.files?.[0]?.file?.url,
      thumbnailType: getThumbnailType(
        result.properties.thumbnail.files?.[0]?.name
      ),
      credits: RichText({ richText: result.properties.credits.rich_text }),
      creditsRaw: result.properties.credits.rich_text,
      technologies: result.properties.technologies.multi_select.map(
        (tag) => tag.name
      ),
      features: result.properties.features.multi_select.map((tag) => tag.name),
    }))

  const filtersList = Array.from(
    new Set(list.flatMap((item) => [...item.technologies, ...item.features]))
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
  // .sort((a, b) => {
  //   return new Date(b.created_time) - new Date(a.created_time)
  // })

  const lenis = useLenis()

  return (
    <>
      <CustomHead
        title="Lenis – Get smooth or die trying"
        description="A showcase of neat Lenis implementations"
      />
      <ReactLenis root />
      <div className={s.canvas}>
        <WebGL arm={false} />
      </div>
      <div className={cn(s.page, 'theme-dark')}>
        <Link className={s.logo} href="/">
          <LenisSVG />
        </Link>

        <section className={cn(s.hero, 'layout-block')}>
          <div className={s.tagline}>
            <h1 className={cn('h2', s.title)}>Get smooth or die trying</h1>
            <h2 className={cn('h4', s.subtitle)}>
              A showcase of neat Lenis implementations
            </h2>
          </div>
          <div className={s.buttons}>
            <Button
              className={s.button}
              icon={<Arrow className={cn('icon')} />}
              href="https://darkroom-engineering.notion.site/2c0e97ae01cf80598f03e5fa862b678e"
            >
              Submit your project
            </Button>
            <Button
              className={s.button}
              icon={<CubeSVG className={cn('icon')} />}
              onClick={() => {
                filtersRef.current.setFilters(['Template'])
                filtersRef.current.setSearch('')
                lenis.scrollTo('#filters')
              }}
            >
              find a template
            </Button>
          </div>
        </section>
        {/* <section className={cn('layout-grid', s.grid)}>
          <ShowcaseCard
            key={CARDS[0].title}
            className={cn(s.card, s.featured)}
            {...CARDS[0]}
          />
          <ShowcaseCard
            key={CARDS[1].title}
            className={cn(s.card, s.featured)}
            {...CARDS[1]}
          />
        </section> */}
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
            'layout-grid',
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
                Submit your project
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
    </>
  )
}
