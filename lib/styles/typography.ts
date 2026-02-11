import type { CSSProperties } from 'react'

const fonts = {
  anton: '--font-anton',
  panchang: '--font-panchang',
  roboto: '--font-roboto',
} as const

const typography: TypeStyles = {
  h1: {
    'font-family': `var(${fonts.anton})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '95%',
    'letter-spacing': '0em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 56, desktop: 160 },
  },
  h2: {
    'font-family': `var(${fonts.anton})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': { mobile: '100%', desktop: '90%' },
    'letter-spacing': '0em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 56, desktop: 96 },
  },
  h3: {
    'font-family': `var(${fonts.panchang})`,
    'font-style': 'normal',
    'font-weight': 700,
    'line-height': '90%',
    'letter-spacing': '0em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 20, desktop: 52 },
  },
  h4: {
    'font-family': `var(${fonts.panchang})`,
    'font-style': 'normal',
    'font-weight': 700,
    'line-height': '100%',
    'letter-spacing': '0em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 20, desktop: 28 },
  },
  'p-l': {
    'font-family': `var(${fonts.roboto})`,
    'font-style': 'normal',
    'font-weight': 500,
    'line-height': '100%',
    'letter-spacing': '0em',
    'font-size': { mobile: 32, desktop: 64 },
  },
  p: {
    'font-family': `var(${fonts.roboto})`,
    'font-style': 'normal',
    'font-weight': 500,
    'line-height': { mobile: '125%', desktop: '133%' },
    'letter-spacing': '0em',
    'font-size': { mobile: 16, desktop: 18 },
  },
  'p-s': {
    'font-family': `var(${fonts.roboto})`,
    'font-style': 'normal',
    'font-weight': 900,
    'line-height': { mobile: '100%', desktop: '114%' },
    'letter-spacing': '0em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 14, desktop: 14 },
  },
  'p-xs': {
    'font-family': `var(${fonts.roboto})`,
    'font-style': 'normal',
    'font-weight': 900,
    'line-height': { mobile: '100%', desktop: '113%' },
    'letter-spacing': '0em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 12, desktop: 12 },
  },
  cta: {
    'font-family': `var(${fonts.roboto})`,
    'font-style': 'normal',
    'font-weight': 900,
    'line-height': { mobile: '200%', desktop: '200%' },
    'letter-spacing': '0em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 14, desktop: 14 },
  },
} as const

export { fonts, typography }

// UTIL TYPES
type TypeStyles = Record<
  string,
  {
    'font-family': string
    'font-style': CSSProperties['fontStyle']
    'font-weight': CSSProperties['fontWeight']
    'line-height':
      | `${number}%`
      | { mobile: `${number}%`; desktop: `${number}%` }
    'letter-spacing':
      | `${number}em`
      | { mobile: `${number}em`; desktop: `${number}em` }
    'text-transform'?: CSSProperties['textTransform']
    'font-feature-settings'?: string
    'font-size': number | { mobile: number; desktop: number }
  }
>
