/**
 * Migration script: Cloudinary → S3
 *
 * Migrates all assets from Cloudinary's lenis-showcase folder to S3.
 *
 * Usage:
 *   bun run scripts/migrate-cloudinary-to-s3.ts
 *
 * Required env vars:
 *   - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *   - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET_NAME
 */

import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { v2 as cloudinary } from 'cloudinary'

// Config
const CLOUDINARY_FOLDER = 'lenis-showcase'
const S3_FOLDER = 'media'

// Initialize Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!(cloudName && apiKey && apiSecret)) {
  throw new Error('Missing Cloudinary credentials')
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

// Initialize S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.S3_BUCKET_NAME!

interface CloudinaryResource {
  public_id: string
  secure_url: string
  resource_type: 'image' | 'video'
  format: string
  bytes: number
}

async function listCloudinaryAssets(
  resourceType: 'image' | 'video'
): Promise<CloudinaryResource[]> {
  const resources: CloudinaryResource[] = []
  let nextCursor: string | undefined

  do {
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: resourceType,
      prefix: CLOUDINARY_FOLDER,
      max_results: 500,
      next_cursor: nextCursor,
    })

    resources.push(...result.resources)
    nextCursor = result.next_cursor
  } while (nextCursor)

  return resources
}

async function checkS3Exists(key: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }))
    return true
  } catch {
    return false
  }
}

async function downloadAsBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download: ${url} (${response.status})`)
  }
  return Buffer.from(await response.arrayBuffer())
}

function getContentType(format: string, resourceType: string): string {
  if (resourceType === 'video') {
    const videoTypes: Record<string, string> = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      mov: 'video/quicktime',
    }
    return videoTypes[format] || 'video/mp4'
  }

  const imageTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    avif: 'image/avif',
    svg: 'image/svg+xml',
  }
  return imageTypes[format] || 'application/octet-stream'
}

async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<void> {
  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }

  if (buffer.length > 5 * 1024 * 1024) {
    const upload = new Upload({ client: s3Client, params })
    await upload.done()
  } else {
    await s3Client.send(new PutObjectCommand(params))
  }
}

async function migrateResource(resource: CloudinaryResource): Promise<boolean> {
  // Extract filename from public_id (remove folder prefix)
  const filename = resource.public_id.replace(`${CLOUDINARY_FOLDER}/`, '')
  const key = `${S3_FOLDER}/${filename}.${resource.format}`

  // Check if already exists in S3
  if (await checkS3Exists(key)) {
    console.log(`⏭️  Skip (exists): ${key}`)
    return false
  }

  try {
    // Download from Cloudinary
    console.log(`⬇️  Downloading: ${resource.secure_url}`)
    const buffer = await downloadAsBuffer(resource.secure_url)

    // Upload to S3
    const contentType = getContentType(resource.format, resource.resource_type)
    console.log(
      `⬆️  Uploading: ${key} (${(buffer.length / 1024).toFixed(1)} KB)`
    )
    await uploadToS3(buffer, key, contentType)

    // For videos, also migrate the poster (first frame)
    if (resource.resource_type === 'video') {
      const posterKey = `${S3_FOLDER}/${filename}-poster.jpg`
      if (!(await checkS3Exists(posterKey))) {
        const posterUrl = cloudinary.url(resource.public_id, {
          resource_type: 'video',
          format: 'jpg',
          transformation: [
            { width: 800, crop: 'limit' },
            { quality: 'auto' },
            { start_offset: '0' },
          ],
        })
        console.log(`⬇️  Downloading poster: ${posterUrl}`)
        const posterBuffer = await downloadAsBuffer(posterUrl)
        console.log(`⬆️  Uploading poster: ${posterKey}`)
        await uploadToS3(posterBuffer, posterKey, 'image/jpeg')
      }
    }

    console.log(`✅ Migrated: ${key}`)
    return true
  } catch (error) {
    console.error(`❌ Failed: ${key}`, error)
    return false
  }
}

async function main() {
  console.log('🚀 Starting Cloudinary → S3 migration')
  console.log(`   Source: Cloudinary folder "${CLOUDINARY_FOLDER}"`)
  console.log(`   Target: S3 bucket "${BUCKET}/${S3_FOLDER}"`)
  console.log('')

  // List all assets
  console.log('📋 Listing Cloudinary assets...')
  const [images, videos] = await Promise.all([
    listCloudinaryAssets('image'),
    listCloudinaryAssets('video'),
  ])

  console.log(`   Found ${images.length} images, ${videos.length} videos`)
  console.log('')

  const allResources = [...images, ...videos]

  if (allResources.length === 0) {
    console.log('✨ Nothing to migrate!')
    return
  }

  // Migrate each resource
  let migrated = 0
  let skipped = 0
  const failed = 0

  for (const resource of allResources) {
    const result = await migrateResource(resource)
    if (result) {
      migrated++
    } else {
      skipped++
    }
  }

  console.log('')
  console.log('📊 Migration complete:')
  console.log(`   ✅ Migrated: ${migrated}`)
  console.log(`   ⏭️  Skipped:  ${skipped}`)
  console.log(`   ❌ Failed:   ${failed}`)
}

main().catch(console.error)
