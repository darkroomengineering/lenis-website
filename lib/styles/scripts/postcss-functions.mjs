// THIS FILE HAS TO STAY .mjs AS ITS CONSUMED BY POSTCSS
import { screens } from '../layout.mjs'

function validatePixels(pixels, device) {
  const numPixels = Number.parseFloat(pixels)

  if (Number.isNaN(numPixels)) {
    throw new Error(`Invalid pixel value: ${pixels}`)
  }
  if (screens[device].width === 0 || screens[device].height === 0) {
    throw new Error(`Screen ${device} dimensions cannot be zero`)
  }
  return numPixels
}

export const functions = {
  'mobile-vw': (pixels) => {
    const numPixels = validatePixels(pixels, 'mobile')
    return `${(numPixels * 100) / screens.mobile.width}vw`
  },
  'mobile-vh': (pixels) => {
    const numPixels = validatePixels(pixels, 'mobile')
    const vh = `${(numPixels * 100) / screens.mobile.height}`
    return `clamp(${vh}vh, ${vh}svh, ${vh}dvh)`
  },
  'desktop-vw': (pixels) => {
    const numPixels = validatePixels(pixels, 'desktop')
    return `${(numPixels * 100) / screens.desktop.width}vw`
  },
  'desktop-vh': (pixels) => {
    const numPixels = validatePixels(pixels, 'desktop')
    return `${(numPixels * 100) / screens.desktop.height}svh`
  },
  'device-vw': (pixels) => {
    const numPixels = Number.parseFloat(pixels)
    if (Number.isNaN(numPixels)) {
      throw new Error(`Invalid pixel value: ${pixels}`)
    }
    return `calc(((${numPixels} * 100) / var(--device-width)) * 1vw)`
  },
  columns: (columns) => {
    const numColumns = Number.parseFloat(columns)
    if (Number.isNaN(numColumns)) {
      throw new Error(`Invalid column value: ${columns}`)
    }
    return `calc((${numColumns} * var(--column-width)) + ((${numColumns} - 1) * var(--gap)))`
  },
}
