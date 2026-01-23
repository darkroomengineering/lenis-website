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
- [AWS S3](https://aws.amazon.com/s3/) - Media storage (default)
- [Cloudinary](https://cloudinary.com/) - Media CDN (alternative)

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
│   ├── media/          # Media storage service (S3/Cloudinary/Mux)
│   ├── styles/         # Global CSS, Tailwind config
│   ├── store.js        # Zustand state store
│   └── ...             # Utilities
├── scripts/            # Utility scripts (migration, etc.)
└── public/             # Static assets
```

## Showcase Media Pipeline

The `/showcase` page pulls submissions from a Notion database. Since Notion serves media via temporary S3 URLs (~1hr expiry), we use a permanent storage provider (S3 or Cloudinary).

### Architecture

```
Notion Form → Notion DB → [S3 or Cloudinary] → Next.js Image optimization → User
                              ↑
                    Cron job (every 10 min)
                              or
                    Notion webhook (instant)
```

### How It Works

1. **Submissions**: Users submit projects via [Notion form](https://darkroom-engineering.notion.site/2c0e97ae01cf80598f03e5fa862b678e)
2. **Sync**: A cron job runs every 10 minutes to check for new/updated entries
3. **Media Processing**: New images/videos are uploaded to the configured provider with deterministic filenames
4. **Deduplication**: Provider checks if asset exists before uploading (via filename hash)
5. **Video Posters**: For videos, a poster image is generated from the first frame (S3: WASM ffmpeg, Cloudinary: auto-generated)
6. **Delivery**: Next.js Image component optimizes on delivery (format conversion, resizing)

### Media Providers

| Provider | Pros | Cons |
|----------|------|------|
| **S3** (default) | Unlimited, ~$0.01/month, no rate limits | No on-the-fly transforms, slower poster generation |
| **Cloudinary** | Auto transforms, fast poster generation | 500 API calls/day limit (free tier) |
| **Mux** | Best for video streaming | 10 video limit (free tier) |

### Environment Variables

```env
# Media Provider: 's3' | 'cloudinary' | 'mux'
MEDIA_PROVIDER=s3

# AWS S3 (when MEDIA_PROVIDER=s3)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# Cloudinary (when MEDIA_PROVIDER=cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mux (when MEDIA_PROVIDER=mux)
MUX_TOKEN_ID=your_token_id
MUX_TOKEN_SECRET=your_token_secret

# Notion (required for showcase data)
NOTION_TOKEN=your_notion_integration_token

# API Security
CRON_SECRET=generate_with_openssl_rand_base64_32
REVALIDATE_SECRET=generate_with_openssl_rand_base64_32
NOTION_WEBHOOK_SECRET=generate_with_openssl_rand_base64_32
```

### API Endpoints

| Endpoint | Purpose | Auth | Trigger |
|----------|---------|------|---------|
| `/api/cron/sync-showcase` | Sync all published entries | `Authorization: Bearer $CRON_SECRET` | Vercel Cron (every 10 min) |
| `/api/notion-webhook` | Instant updates on Notion changes | `Authorization: Bearer $NOTION_WEBHOOK_SECRET` | Notion webhook |
| `/api/revalidate` | Manual cache invalidation | `Authorization: Bearer $REVALIDATE_SECRET` | Manual trigger |

### Switching Providers

Change the provider by setting the `MEDIA_PROVIDER` environment variable:

```bash
# Use S3 (default, recommended)
MEDIA_PROVIDER=s3

# Use Cloudinary
MEDIA_PROVIDER=cloudinary

# Use Mux (videos only)
MEDIA_PROVIDER=mux
```

No code changes needed - just update the env var and redeploy.

### S3 Bucket Setup

If using S3, create a bucket with public read access:

```bash
# Create bucket
aws s3api create-bucket --bucket your-bucket-name --region us-east-1

# Enable public read
aws s3api put-bucket-policy --bucket your-bucket-name --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicRead",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-bucket-name/*"
  }]
}'

# Set CORS
aws s3api put-bucket-cors --bucket your-bucket-name --cors-configuration '{
  "CORSRules": [{"AllowedOrigins": ["*"], "AllowedMethods": ["GET", "HEAD"], "AllowedHeaders": ["*"], "MaxAgeSeconds": 86400}]
}'
```

### Migration: Cloudinary to S3

To migrate existing assets from Cloudinary to S3:

```bash
# Ensure both Cloudinary and S3 env vars are set
bun run scripts/migrate-cloudinary-to-s3.ts
```

The script will:
1. List all assets in Cloudinary's `lenis-showcase` folder
2. Download each asset
3. Upload to S3 with the same filename
4. Generate video posters using Cloudinary's transformation API
5. Skip assets that already exist in S3

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
├── providers/
│   ├── index.ts          # Provider registry (env-based selection)
│   ├── s3.ts             # AWS S3 implementation
│   ├── cloudinary.ts     # Cloudinary implementation
│   └── mux.ts            # Mux implementation
└── utils/
    └── ffmpeg.ts         # WASM-based video poster generation

scripts/
└── migrate-cloudinary-to-s3.ts  # Migration script
```

## Security

### API Authentication
- All API endpoints require bearer token authentication
- Tokens should be generated with `openssl rand -base64 32`
- Timing-safe comparison is used to prevent timing attacks

### SSRF Protection
- URL fetching is restricted to an allowlist of trusted hosts
- Only Notion S3, Cloudinary, and Mux URLs are allowed

### Best Practices
- Never commit `.env.local` or secrets to git
- Rotate secrets periodically
- Use IAM roles with minimal permissions for S3

## Development

Debug mode: Press `Cmd/Ctrl + O` to toggle debug overlay

## Deployment

Hosted on [Vercel](https://vercel.com) with automatic deployments from GitHub.
