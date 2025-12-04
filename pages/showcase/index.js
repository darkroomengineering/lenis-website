import ShowcaseCard from 'components/showcase/card'
import s from './showcase.module.scss'
import cn from 'clsx'
import { Footer } from 'components/footer'

const IMAGES = [
  '/placeholder/68fa8128610a7926725697.png',
  '/placeholder/6900d08689edd726047249.jpg',
  '/placeholder/69008cf4950da403826429.jpg',
  '/placeholder/opengraph-image.jpg',
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
    <div className={s.page}>
      <section className={s.hero}>
        <h1 className="h1 ">Showcase</h1>
      </section>
      <section className={cn('layout-grid', s.grid)}>
        {CARDS.map((card) => (
          <ShowcaseCard key={card.title} className={s.card} {...card} />
        ))}
      </section>
      <Footer />
    </div>
  )
}
