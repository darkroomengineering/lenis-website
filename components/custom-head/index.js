import NextHead from 'next/head'

export function CustomHead({ title = '', description, image, keywords }) {
  const imageUrl = image?.url || 'https://lenis.darkroom.engineering/og.png?v=1'
  const imageWidth = image?.width || 1200
  const imageHeight = image?.height || 630

  return (
    <NextHead>
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta httpEquiv="x-dns-prefetch-control" content="off" />
      <meta httpEquiv="Window-Target" content="_value" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={
          process.env.NODE_ENV !== 'development'
            ? 'index,follow'
            : 'noindex,nofollow'
        }
      />
      <meta
        name="googlebot"
        content={
          process.env.NODE_ENV !== 'development'
            ? 'index,follow'
            : 'noindex,nofollow'
        }
      />

      <meta
        name="keywords"
        content={Array.isArray(keywords) ? keywords.join(',') : keywords}
      />
      <meta name="author" content="darkroom.engineering" />
      <meta name="referrer" content="no-referrer" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="geo.region" content="US" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt" content={title} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@LenisSmooth" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* START FAVICON */}
      <link rel="manifest" href="/site.webmanifest" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff98a2" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="icon" href="/favicon.ico" />
      {/* END FAVICON */}
    </NextHead>
  )
}
