'use client'

import ShowcaseCard from 'components/showcase/card'
import s from './showcase.module.scss'
import cn from 'clsx'
import { Footer } from 'components/footer'
import { Button } from 'components/button'
import Arrow from 'icons/arrow-buttons.svg'
import { Filters } from 'components/showcase/filters'
import { ReactLenis } from 'lenis/react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Client } from '@notionhq/client'
import { RichText } from 'lib/notion'
// @refresh reset

const WebGL = dynamic(
  () => import('components/webgl').then(({ WebGL }) => WebGL),
  { ssr: false }
)

// const IMAGES = [
//   '/placeholder/68fa8128610a7926725697.png',
//   '/placeholder/6900d08689edd726047249.jpg',
//   '/placeholder/69008cf4950da403826429.jpg',
//   '/placeholder/opengraph-image.jpg',
//   '/og.png',
// ]

// const TITLES = [
//   'Grand Theft Auto VI',
//   'Shopify Supply',
//   'Metamask',
//   'Getty - Sculpting Harmony',
// ]

// const CREDITS = [
//   'Rockstar Games',
//   'Shopify',
//   'Antinomy',
//   'Resn',
//   'darkroom.engineering',
// ]

// const CARDS = Array.from({ length: 10 }, (_, index) => ({
//   title: TITLES[index % TITLES.length],
//   credits: {
//     text: CREDITS[index % CREDITS.length],
//     href: 'https://darkroom.engineering',
//   },
//   image: IMAGES[index % IMAGES.length],
//   href: 'https://www.rockstargames.com/VI',
// }))

export async function getStaticProps() {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  })
  const database = await notion.dataSources.query({
    data_source_id: '2c0e97ae-01cf-80a8-aa3c-000b46741671',
  })
  return { props: { database }, revalidate: 3600 } // revalidate every hour
}

export default function Showcase({ database }) {
  const [filters, setFilters] = useState([])

  // const list = database.results.map((result) => ({
  //   title: result.properties.title.title[0].plain_text,
  //   credits: result.properties.Credits.rich_text[0].plain_text,
  //   image: result.properties.Image.files[0].file.url,
  //   href: result.properties.Link.url,
  // }))

  console.log(filters)
  const list = database.results.map((result) => ({
    title: result.properties.title.rich_text[0].plain_text,
    href: result.properties.url.url.startsWith('http')
      ? result.properties.url.url
      : 'https://' + result.properties.url.url,
    // credits: result.properties.Credits.rich_text[0].plain_text,
    image: result.properties.thumbnail.files[0].file.url,
    credits: RichText({ richText: result.properties.credits.rich_text }),
    // href: result.properties.Link.url,
  }))

  console.log(list)

  return (
    <>
      <ReactLenis root />
      <div className={s.canvas}>
        <WebGL arm={false} />
      </div>
      <div className={cn(s.page, 'theme-dark')}>
        <section className={s.hero}>
          <div className={s.tagline}>
            <h1 className="h2">Get smooth or die trying</h1>
            <h2 className="h4">A showcase of neat Lenis implementations</h2>
          </div>
          <Button
            className={s.button}
            icon={<Arrow />}
            href="https://darkroom-engineering.notion.site/2c0e97ae01cf80598f03e5fa862b678e"
          >
            Submit your project
          </Button>
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
        <Filters className={s.filters} onChange={setFilters} />
        <section className={cn('layout-grid', s.grid)}>
          {list.map((card) => (
            <ShowcaseCard key={card.title} className={cn(s.card)} {...card} />
          ))}
        </section>
        <Footer theme="dark" />
      </div>
    </>
  )
}
