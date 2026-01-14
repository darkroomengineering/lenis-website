import { Anton, Roboto } from 'next/font/google'

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

const fonts = [anton, roboto]
const fontsVariable = fonts.map((font) => font.variable).join(' ')

export { anton, fontsVariable, roboto }
