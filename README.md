# Lenis Website

## Setup

The usual process for Next.js based apps/websites:

1. Install node modules:

   `$ pnpm i`

2. Get the .env variables from Vercel (check `.env.template`), after [installing Vercel CLI](https://vercel.com/docs/cli):

   `$ vc link`

   `$ vc env pull`

3. Set up GSAP authentication:
   
   Copy `.npmrc.config` to `.npmrc` and replace `GSAP_AUTH_TOKEN` with your token

4. Run development environment:

   `$ pnpm dev`

## Stack

- [Lenis](https://github.com/darkroomengineering/lenis) - Smooth scroll library
- [Tempus](https://github.com/darkroomengineering/tempus) - Animation timing control
- [Hamo](https://github.com/darkroomengineering/hamo) - React hooks and utilities
- [PNPM](https://pnpm.io/) - Package manager
- [Next.js](https://nextjs.org/) - React framework
- [Three.js](https://threejs.org/) - 3D graphics
- [@react-three/drei](https://github.com/pmndrs/drei) - Three.js React utilities
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) - Three.js React renderer
- [GSAP Business](https://greensock.com/gsap/) - Animation library
- [Sass Modules](https://sass-lang.com/) - CSS preprocessing
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Next PWA](https://www.npmjs.com/package/next-pwa) - Progressive Web App support
- [Next SEO](https://github.com/garmeeh/next-seo) - SEO optimization
- [Next Sitemap](https://github.com/iamvishnusankar/next-sitemap) - Sitemap generation
- [@svgr/webpack](https://github.com/gregberge/svgr/tree/main) - SVG imports

## Code Style & Linting

- Eslint ([Next](https://nextjs.org/docs/basic-features/eslint#eslint-config) and [Prettier](https://github.com/prettier/eslint-config-prettier) plugins)
- [Prettier](https://prettier.io/) with the following settings:
  ```json
  {
    "endOfLine": "auto",
    "semi": false,
    "singleQuote": true
  }
  ```
- [Husky + lint-staged precommit hooks](https://github.com/okonet/lint-staged)

## Development Tools

- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer) - Analyze bundle sizes
- [Duplicate Package Checker](https://www.npmjs.com/package/duplicate-package-checker-webpack-plugin) - Check for duplicate packages
- [Stats.js](https://github.com/mrdoob/stats.js/) - Performance monitoring
- [Leva](https://github.com/pmndrs/leva) - Debug UI controls

## Folder Structure

Alongside the usual Next.js folder structure (`/public`, `/pages`, etc.) We've added a few other folders:

- **/assets:** General Images/Videos and SVGs
- **/components:** Reusable components with their respective Sass files
- **/config:** General settings (mostly Leva for now)
- **/hooks:** Reusable Custom Hooks
- **/layouts:** High level layout components
- **/lib:** Reusable Scripts and State Store
- **/styles:** Global styles and Sass partials

## Deployment

- [Vercel](https://vercel.com/home) - Hosting & Continuous Deployment
- [GitHub](https://github.com/) - Version Control
