# Lenis Website

The official website for [Lenis](https://github.com/darkroomengineering/lenis), the smooth scroll library.

## Setup

1. Install dependencies:

   ```bash
   bun install
   ```

2. Get the .env variables from Vercel:

   ```bash
   vc link
   vc env pull
   ```

3. Run development environment:

   ```bash
   bun dev
   ```

## Stack

### Core
- [Next.js 16](https://nextjs.org/) - React framework with Turbopack
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Bun](https://bun.sh/) - Package manager and runtime

### Styling
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS
- [CSS Modules](https://github.com/css-modules/css-modules) - Scoped styles
- [PostCSS](https://postcss.org/) - CSS processing

### Animation & Graphics
- [Lenis](https://github.com/darkroomengineering/lenis) - Smooth scroll
- [Tempus](https://github.com/darkroomengineering/tempus) - RAF management
- [Hamo](https://github.com/darkroomengineering/hamo) - React hooks
- [GSAP](https://greensock.com/gsap/) - Animation library
- [Three.js](https://threejs.org/) - 3D graphics
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [@react-three/drei](https://github.com/pmndrs/drei) - Three.js helpers

### State & Data
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Notion API](https://developers.notion.com/) - Showcase data

## Code Quality

### Linting & Formatting
- [Biome](https://biomejs.dev/) - Fast linter and formatter (replaces ESLint + Prettier)
- [Lefthook](https://github.com/evilmartians/lefthook) - Git hooks

### Pre-commit Checks
- Biome lint + format (auto-fix enabled)
- TypeScript type checking

Run manually:
```bash
bun biome check --write .   # Lint and format
bun typecheck               # Type check
```

## Folder Structure

```
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── icons/          # SVG icons (imported as React components)
├── layouts/        # Page layout components
├── lib/
│   ├── styles/     # Global CSS, Tailwind config
│   ├── store.js    # Zustand state store
│   └── ...         # Utilities
├── pages/          # Next.js pages (Pages Router)
└── public/         # Static assets
```

## Development

Debug mode: Press `Cmd/Ctrl + O` to toggle debug overlay

## Deployment

Hosted on [Vercel](https://vercel.com) with automatic deployments from GitHub.
