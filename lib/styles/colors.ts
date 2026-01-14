const colors = {
  black: 'rgb(0, 0, 0)',
  'black-transparent': 'rgba(0, 0, 0, 0)',
  white: 'rgb(239, 239, 239)',
  'white-transparent': 'rgba(239, 239, 239, 0)',
  grey: 'rgb(176, 176, 176)',
  pink: 'rgb(255, 152, 162)',
  'pink-transparent': 'rgba(255, 152, 162, 0)',
} as const

const themeNames = ['light', 'dark', 'contrast'] as const
const colorNames = [
  'primary',
  'secondary',
  'contrast',
  'primary-transparent',
] as const

const themes = {
  light: {
    primary: colors.white,
    secondary: colors.black,
    contrast: colors.pink,
    'primary-transparent': colors['white-transparent'],
  },
  dark: {
    primary: colors.black,
    secondary: colors.white,
    contrast: colors.pink,
    'primary-transparent': colors['black-transparent'],
  },
  contrast: {
    primary: colors.pink,
    secondary: colors.black,
    contrast: colors.white,
    'primary-transparent': colors['pink-transparent'],
  },
} as const satisfies Themes

export { colors, themeNames, themes }

// UTIL TYPES
export type Themes = Record<
  (typeof themeNames)[number],
  Record<(typeof colorNames)[number], string>
>
