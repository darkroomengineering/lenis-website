import type { Config } from '../config'
import { formatObject, scalingCalc } from './utils'

type ResponsiveValue = { mobile: number; desktop: number }

// Font family definitions for fonts not loaded via Next.js font loader
// Anton and Roboto are set by Next.js via className, but Panchang is loaded via Fontshare
const fontFamilies: Record<string, string> = {
  anton: "'Anton', sans-serif",
  panchang: "'Panchang', sans-serif",
  roboto: "'Roboto', sans-serif",
}

export function generateRoot({
  breakpoints,
  colors,
  customSizes,
  easings,
  fonts,
  layout,
  screens,
}: Pick<
  Config,
  | 'breakpoints'
  | 'colors'
  | 'customSizes'
  | 'easings'
  | 'fonts'
  | 'layout'
  | 'screens'
>) {
  return `@custom-media --hover (hover: hover);
@custom-media --mobile (width <= ${breakpoints.dt - 0.02}px);
@custom-media --desktop (width >= ${breakpoints.dt}px);
@custom-media --reduced-motion (prefers-reduced-motion: reduce);

:root {
	/* Font family fallbacks - Next.js sets these via className, but we provide fallbacks */
	${formatObject(fonts, ([name, variable]) => {
    const family = fontFamilies[name] || `var(${variable})`
    return `${variable}: ${family};`
  })}

	--device-width: ${screens.mobile.width};
	--device-height: ${screens.mobile.height};

	${formatObject(layout, ([name, val]) => {
    const value = val as ResponsiveValue
    if (name === 'columns') return `--columns: ${value.mobile};`

    return `--${name}: ${scalingCalc(value.mobile)};`
  })}

	${formatObject(customSizes, ([name, val]) => {
    const value = val as ResponsiveValue
    return `--${name}: ${scalingCalc(value.mobile)};`
  })}

	--layout-width: calc(100vw - (2 * var(--safe)));
	--column-width: calc((var(--layout-width) - (var(--columns) - 1) * var(--gap)) / var(--columns));

	/* Legacy aliases for backward compatibility */
	--layout-columns-count: var(--columns);
	--layout-columns-gap: var(--gap);
	--layout-margin: var(--safe);
	--layout-column-width: calc((var(--layout-width) - ((var(--layout-columns-count) - 1) * var(--layout-columns-gap))) / var(--layout-columns-count));

	${formatObject(easings, ([name, value]) => `--ease-${name}: ${value};`)}

	${formatObject(colors, ([name, value]) => `--color-${name}: ${value};`)}

	@variant dt {
    --device-width: ${screens.desktop.width};
    --device-height: ${screens.desktop.height};

    ${formatObject(
      layout,
      ([name, val]) => {
        const value = val as ResponsiveValue
        if (name === 'columns') return `--columns: ${value.desktop};`

        return `--${name}: ${scalingCalc(value.desktop)};`
      },
      '\n\t\t'
    )}

    ${formatObject(
      customSizes,
      ([name, val]) => {
        const value = val as ResponsiveValue
        return `--${name}: ${scalingCalc(value.desktop)};`
      },
      '\n\t\t'
    )}
	}
}
  `
}
