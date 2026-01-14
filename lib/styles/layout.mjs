// THIS FILE HAS TO STAY .mjs AS ITS CONSUMED BY POSTCSS
const breakpoints = {
  dt: 800,
}

const screens = {
  mobile: { width: 375, height: 650 },
  desktop: { width: 1440, height: 816 },
}

const layout = {
  columns: { mobile: 6, desktop: 12 },
  gap: { mobile: 24, desktop: 24 },
  safe: { mobile: 16, desktop: 40 },
}

const customSizes = {
  'header-height': { mobile: 58, desktop: 98 },
  'spacer-xl': { mobile: 80, desktop: 192 },
  'spacer-lg': { mobile: 64, desktop: 128 },
  'spacer-md': { mobile: 48, desktop: 80 },
  'spacer-sm': { mobile: 32, desktop: 64 },
  'spacer-xs': { mobile: 32, desktop: 48 },
}

export { breakpoints, customSizes, layout, screens }
