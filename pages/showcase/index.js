import ShowcaseCard from 'components/showcase/card'
import s from './showcase.module.scss'
import cn from 'clsx'
import { Footer } from 'components/footer'
import { Button } from 'components/button'
import Arrow from 'icons/arrow-buttons.svg'
import { Filters } from 'components/showcase/filters'
import { ReactLenis } from 'lenis/react'

const IMAGES = [
  '/placeholder/68fa8128610a7926725697.png',
  '/placeholder/6900d08689edd726047249.jpg',
  '/placeholder/69008cf4950da403826429.jpg',
  '/placeholder/opengraph-image.jpg',
  '/og.png',
]

const TITLES = [
  'Grand Theft Auto VI',
  'Shopify Supply',
  'Metamask',
  'Getty - Sculpting Harmony',
]

const CREDITS = [
  'Rockstar Games',
  'Shopify',
  'Antinomy',
  'Resn',
  'darkroom.engineering',
]

const CARDS = Array.from({ length: 10 }, (_, index) => ({
  title: TITLES[index % TITLES.length],
  credits: {
    text: CREDITS[index % CREDITS.length],
    href: 'https://darkroom.engineering',
  },
  image: IMAGES[index % IMAGES.length],
  href: 'https://www.rockstargames.com/VI',
}))

export default function Showcase() {
  return (
    <>
      <ReactLenis root />
      <div className={cn(s.page, 'theme-dark')}>
        <section className={s.hero}>
          <div className={s.tagline}>
            <h1 className="h2">Get smooth or die trying</h1>
            <h2 className="h4">A showcase of neat Lenis implementations</h2>
          </div>
          <Button
            className={s.button}
            icon={<Arrow />}
            href="https://darkroom-engineering.notion.site/2c0e97ae01cf80e28087ceb59c414746"
          >
            Submit your project
          </Button>
        </section>
        <Filters className={s.filters} />
        <section className={cn('layout-grid', s.grid)}>
          {/* <ShowcaseCard className={cn(s.featured)} {...CARDS[0]} /> */}
          {/* <ShowcaseCard className={cn(s.featured)} {...CARDS[0]} /> */}
          {/* <div className={s.subgrid}>
          <div className={s.blank}>
            <input
              type="text"
              placeholder="Search"
              className={cn(s.search, 'p')}
            />
            <div className={cn(s.tags, 'p')}>
              <span className={s.tag}>All</span>
              <span className={s.tag}>Infinite</span>
              <span className={s.tag}>Snap</span>
              <span className={s.tag}>Horizontal</span>
              <span className={s.tag}>WebGL</span>
              <span className={s.tag}>Framer</span>
            </div>
            <Button className={s.searchButton} icon={<Arrow />}>
              Submit your project
            </Button>
          </div>
          <div className={s.cards}>
            <ShowcaseCard className={cn(s.card)} {...CARDS[0]} />
            <ShowcaseCard className={cn(s.card)} {...CARDS[0]} />
          </div>
        </div> */}
          {CARDS.map((card, index) => (
            <ShowcaseCard
              key={card.title}
              className={cn(s.card, (index === 0 || index === 1) && s.featured)}
              {...card}
            />
          ))}
        </section>
        <Footer theme="dark" />
      </div>
    </>
  )
}
