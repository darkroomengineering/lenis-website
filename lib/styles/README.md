# Styling System

This project uses a TypeScript-based styling system with generated Tailwind CSS utilities, following the [Satus](https://github.com/darkroomengineering/satus) architecture.

## Architecture

```
lib/styles/
├── css/
│   ├── index.css        # Entry point (imports all CSS)
│   ├── reset.css        # CSS reset
│   ├── tailwind.css     # GENERATED - theme, utilities, variants
│   ├── root.css         # GENERATED - CSS custom properties
│   └── global.css       # Manual global styles
├── scripts/
│   ├── setup-styles.ts  # Main generation script
│   ├── generate-root.ts
│   ├── generate-tailwind.ts
│   ├── generate-scale.ts
│   ├── postcss-functions.mjs
│   └── utils.ts
├── colors.ts            # Color palette & themes
├── easings.ts           # Animation curves
├── layout.mjs           # Grid, breakpoints, spacing
├── typography.ts        # Font sizes, weights, families
├── fonts.ts             # Font loading (Next.js)
├── config.ts            # Barrel export
└── index.ts             # Public export
```

## Key Concepts

### Generated vs Manual CSS

- **Generated files** (`tailwind.css`, `root.css`) are created by `setup-styles.ts` - DO NOT EDIT DIRECTLY
- **Manual files** (`global.css`, `reset.css`) are edited by hand for truly global styles
- TypeScript config files are the **source of truth** for design tokens

### Running the Generator

```bash
bun run setup:styles
```

This is automatically run before builds (`bun run build`).

## Using Utilities

### Typography

```tsx
// Generated @utility directives
<h1 className="h1">Large heading</h1>
<h2 className="h2">Medium heading</h2>
<p className="p">Body text</p>
<span className="p-xs">Small text</span>

// Viewport height variant
<h1 className="h1 vh">Sized by viewport height</h1>
```

### Layout

```tsx
// dr-* layout utilities
<div className="dr-layout-block">Constrained width</div>
<div className="dr-layout-grid">Grid with columns</div>
<div className="dr-layout-grid-inner">Grid with padding</div>
```

### Responsive

```tsx
// Show/hide by device
<div className="desktop-only">Desktop only</div>
<div className="mobile-only">Mobile only</div>
```

### Viewport-Relative Sizing (dr-* scale)

```tsx
// Sizes that scale with viewport
<div className="dr-p-24">padding: calc((24 * 100) / device-width * 1vw)</div>
<div className="dr-w-100">width scaled to viewport</div>
<div className="dr-mt-48">margin-top scaled to viewport</div>

// Column-based sizing
<div className="dr-w-col-4">Width of 4 columns + 3 gaps</div>
```

### Theme

```tsx
// Theme via data-theme attribute
<div data-theme="light">Light theme</div>
<div data-theme="dark">Dark theme</div>
<div data-theme="contrast">Contrast theme</div>
```

## PostCSS Functions

Available in CSS modules:

```css
.element {
  /* Viewport-relative sizing */
  padding: mobile-vw(24);
  margin: desktop-vw(48);

  /* Column-based sizing */
  width: columns(4);

  /* Responsive */
  @media (--desktop) {
    padding: desktop-vw(48);
  }
}
```

## Adding New Design Tokens

### Colors

Edit `lib/styles/colors.ts`:

```ts
const colors = {
  black: 'rgb(0, 0, 0)',
  white: 'rgb(239, 239, 239)',
  // Add new color here
  accent: 'rgb(255, 100, 100)',
}
```

### Typography

Edit `lib/styles/typography.ts`:

```ts
const typography = {
  h1: { /* ... */ },
  // Add new style
  'label': {
    'font-family': `var(${fonts.roboto})`,
    'font-style': 'normal',
    'font-weight': 700,
    'line-height': '100%',
    'letter-spacing': '0.1em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 12, desktop: 14 },
  },
}
```

### Spacing

Edit `lib/styles/layout.mjs`:

```js
const customSizes = {
  'header-height': { mobile: 58, desktop: 98 },
  // Add new size
  'footer-height': { mobile: 100, desktop: 200 },
}
```

After changes, run `bun run setup:styles` to regenerate CSS.

## CSS Custom Properties

Available globally:

```css
/* Layout */
--columns: 6 | 12 (mobile | desktop)
--gap: responsive gap
--safe: responsive margin
--layout-width: 100vw - 2 * safe
--column-width: calculated column width

/* Device dimensions */
--device-width: 375 | 1440
--device-height: 650 | 816

/* Spacing */
--header-height, --spacer-xl, --spacer-lg, --spacer-md, --spacer-sm, --spacer-xs

/* Colors */
--color-primary, --color-secondary, --color-contrast
--color-black, --color-white, --color-grey, --color-pink

/* Easings */
--ease-out-expo, --ease-in-out-cubic, etc.
```

## Media Queries

```css
@media (--mobile) { /* width <= 800px */ }
@media (--desktop) { /* width >= 800px */ }
@media (--hover) { /* hover: hover */ }
@media (--reduced-motion) { /* prefers-reduced-motion: reduce */ }
```
