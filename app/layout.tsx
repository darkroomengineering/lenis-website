import type { Metadata, Viewport } from 'next'
import { Anton, Roboto } from 'next/font/google'
import { Providers } from './providers'
import '@/lib/styles/css/index.css'

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '400', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lenis – Get smooth or die trying',
  description: 'A smooth scroll library fresh out of the darkroom.engineering.',
  keywords: [
    'smooth scroll',
    'lenis',
    'scroll library',
    'darkroom.engineering',
  ],
  authors: [{ name: 'darkroom.engineering' }],
  referrer: 'no-referrer',
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Lenis – Get smooth or die trying',
    description:
      'A smooth scroll library fresh out of the darkroom.engineering.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://lenis.darkroom.engineering/og.png?v=1',
        width: 1200,
        height: 630,
        alt: 'Lenis – Get smooth or die trying',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@LenisSmooth',
    title: 'Lenis – Get smooth or die trying',
    description:
      'A smooth scroll library fresh out of the darkroom.engineering.',
    images: ['https://lenis.darkroom.engineering/og.png?v=1'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#000000',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${roboto.variable} ${process.env.NODE_ENV === 'development' ? 'dev' : ''}`}
    >
      <head>
        {/* Fontshare - Panchang (not available in next/font) */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=panchang&display=swap"
          rel="stylesheet"
        />
      </head>
      <body data-theme="dark">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
