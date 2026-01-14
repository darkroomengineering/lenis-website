import type { Config } from '../config'
import { formatObject, scalingCalc } from './utils'

export function generateTailwind({
  breakpoints,
  colors,
  customSizes,
  easings,
  themes,
  typography,
}: Pick<
  Config,
  'breakpoints' | 'colors' | 'customSizes' | 'easings' | 'themes' | 'typography'
>) {
  // Theme
  const themeEntries = Object.entries(themes)
  const firstTheme = themeEntries[0]?.[1] ?? {}
  const theme = `/** Custom theme **/
@theme {
	--breakpoint-*: initial;
	${formatObject(breakpoints, ([name, value]) => `--breakpoint-${name}: ${value}px;`)}

  --color-*: initial;
	${formatObject(firstTheme, ([key, value]) => `--color-${key}: ${value};`)}
  ${formatObject(colors, ([key, value]) => `--color-${key}: ${value};`)}

  --spacing-*: initial;
	--spacing-0: 0;
	--spacing-safe: var(--safe);
	--spacing-gap: var(--gap);
  ${formatObject(customSizes, ([key]) => `--spacing-${key}: var(--${key});`)}

  /* Fonts are set by Next.js font loader, no need to redefine in @theme */

  --ease-*: initial;
  ${formatObject(easings, ([name, value]) => `--ease-${name}: ${value};`)}
}`

  // Theme overwrites
  const themeOverwrites = `
/** Custom theme overwrites **/
${formatObject(
  themes,
  ([name, value]) => `[data-theme=${name}] {
  ${formatObject(value as Record<string, string>, ([key, val]) => `--color-${key}: ${val};`)}
  /* Legacy aliases */
  ${formatObject(value as Record<string, string>, ([key, val]) => `--theme-${key}: ${val};`)}
  background-color: var(--color-primary);
  color: var(--color-secondary);
}`,
  '\n'
)}
  `

  // Utilities
  const utilities = `
/** Custom static utilities **/
${Object.entries(typography)
  .map(
    ([name, style]) => `@utility ${name} {
  ${Object.entries(style)
    .filter(([, val]) => val != null)
    .map(([key, val]) => {
      if (key === 'font-size') {
        if (typeof val === 'number') {
          return `@apply dr-text-${val};`
        }

        const sizeVal = val as { mobile: number; desktop: number }
        return [
          `font-size: ${scalingCalc(sizeVal.mobile)};`,
          `@variant dt { font-size: ${scalingCalc(sizeVal.desktop)}; }`,
        ].join('\n\t')
      }

      if (typeof val === 'object' && val !== null) {
        const objVal = val as { mobile: string; desktop: string }
        return [
          `${key}: ${objVal.mobile};`,
          `@variant dt { ${key}: ${objVal.desktop}; }`,
        ].join('\n\t')
      }

      return `${key}: ${val};`
    })
    .join('\n\t')}
}`
  )
  .join('\n')}

@utility desktop-only {
  @media (--mobile) {
    display: none !important;
  }
}

@utility mobile-only {
  @media (--desktop) {
    display: none !important;
  }
}

@utility dr-grid {
	display: grid;
	grid-template-columns: repeat(var(--columns), 1fr);
	column-gap: var(--gap);
}

@utility dr-layout-block {
	margin-inline: auto;
  width: calc(100% - 2 * var(--safe));
}

@utility dr-layout-block-inner {
	padding-inline: var(--safe);
	width: 100%;
}

@utility dr-layout-grid {
	@apply dr-layout-block dr-grid;
}

@utility dr-layout-grid-inner {
	@apply dr-layout-block-inner dr-grid;
}

/* Viewport Height Typography Variants */
/* Usage: className="h1 vh" - overrides font-size to use vh instead of vw */
@utility vh {
  &.h1 {
    font-size: calc(((56 * 100) / var(--device-height)) * 1vh);
    @variant dt { font-size: calc(((160 * 100) / var(--device-height)) * 1vh); }
  }
  &.h2 {
    font-size: calc(((56 * 100) / var(--device-height)) * 1vh);
    @variant dt { font-size: calc(((96 * 100) / var(--device-height)) * 1vh); }
  }
  &.h3 {
    font-size: calc(((20 * 100) / var(--device-height)) * 1vh);
    @variant dt { font-size: calc(((52 * 100) / var(--device-height)) * 1vh); }
  }
}`

  // Variants
  const variants = `
/** Custom variants **/
${Object.keys(themes)
  .map(
    (name) =>
      `@custom-variant ${name} (&:where([data-theme=${name}], [data-theme=${name}] *));`
  )
  .join('\n')}`

  return [theme, themeOverwrites, utilities, variants].join('\n')
}
