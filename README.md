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
- [Cloudinary](https://cloudinary.com/) - Media CDN and optimization

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
├── app/                # Next.js App Router pages
│   ├── api/            # API routes (cron, webhooks)
│   ├── showcase/       # Showcase page
│   └── ...
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── icons/              # SVG icons (imported as React components)
├── layouts/            # Page layout components
├── lib/
│   ├── media/          # Media CDN service (Cloudinary/Mux)
│   ├── styles/         # Global CSS, Tailwind config
│   ├── store.js        # Zustand state store
│   └── ...             # Utilities
└── public/             # Static assets
```

## Showcase Media Pipeline

The `/showcase` page pulls submissions from a Notion database. Since Notion serves media via temporary S3 URLs (~1hr expiry), we use Cloudinary as a permanent CDN.

### Architecture

```
Notion Form → Notion DB → Cloudinary CDN → Next.js Image optimization → User
                              ↑
                    Cron job (every 10 min)
```

### How It Works

1. **Submissions**: Users submit projects via [Notion form](https://darkroom-engineering.notion.site/2c0e97ae01cf80598f03e5fa862b678e)
2. **Sync**: A cron job runs every 10 minutes to check for new/updated entries
3. **Media Processing**: New images/videos are uploaded to Cloudinary with deterministic public IDs
4. **Caching**: Cloudinary checks if asset exists before uploading (deduplication via public_id)
5. **Delivery**: Next.js Image component optimizes on delivery (format conversion, resizing)

### Environment Variables

```env
# Cloudinary (required for media CDN)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Notion (required for showcase data)
NOTION_TOKEN=your_notion_integration_token

# API Security (required for cron/webhook endpoints)
CRON_SECRET=generate_with_openssl_rand_base64_32
REVALIDATE_SECRET=generate_with_openssl_rand_base64_32
```

### API Endpoints

| Endpoint | Purpose | Trigger |
|----------|---------|---------|
| `/api/cron/sync-showcase` | Sync all published entries | Vercel Cron (every 10 min) |
| `/api/notion-webhook` | Instant updates on Notion changes | Notion webhook (optional) |
| `/api/revalidate` | Manual cache invalidation | Manual trigger |

### Switching Video Providers

The media service supports swappable providers. To switch from Cloudinary to Mux for videos:

```typescript
// lib/media/providers/index.ts
import { muxProvider } from './mux'

// Change this line:
export const videoProvider = cloudinaryProvider
// To:
export const videoProvider = muxProvider
```

Then add Mux environment variables:
```env
MUX_TOKEN_ID=your_token_id
MUX_TOKEN_SECRET=your_token_secret
```

### Manual Sync

Trigger a manual sync (useful for testing):

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://your-domain.vercel.app/api/cron/sync-showcase
```

### File Structure

```
lib/media/
├── index.ts              # Main exports
├── media-resolver.ts     # Core resolution logic
├── types.ts              # TypeScript interfaces
└── providers/
    ├── index.ts          # Provider registry (swap here)
    ├── cloudinary.ts     # Cloudinary implementation
    └── mux.ts            # Mux implementation (optional)
```

## Development

Debug mode: Press `Cmd/Ctrl + O` to toggle debug overlay

## Deployment

Hosted on [Vercel](https://vercel.com) with automatic deployments from GitHub.
