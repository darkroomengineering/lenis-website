import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import type {
  MediaProvider,
  TransformOptions,
  UploadResult,
  VideoUploadResult,
} from '../types'
import { generatePosterFromVideo } from '../utils/ffmpeg'

// Lazy initialization to handle missing env vars gracefully
let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (s3Client) return s3Client

  const region = process.env.AWS_REGION || 'us-east-1'
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

  if (!(accessKeyId && secretAccessKey)) {
    throw new Error(
      'Missing AWS credentials. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.'
    )
  }

  s3Client = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  })

  return s3Client
}

function getBucketName(): string {
  const bucket = process.env.S3_BUCKET_NAME
  if (!bucket) {
    throw new Error('Missing S3_BUCKET_NAME environment variable.')
  }
  return bucket
}

function getS3Url(key: string): string {
  const bucket = getBucketName()
  const region = process.env.AWS_REGION || 'us-east-1'
  // Direct S3 URL - Vercel's edge network handles caching
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}

async function objectExists(key: string): Promise<boolean> {
  try {
    const client = getS3Client()
    await client.send(
      new HeadObjectCommand({
        Bucket: getBucketName(),
        Key: key,
      })
    )
    return true
  } catch {
    return false
  }
}

async function uploadBuffer(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const client = getS3Client()
  const bucket = getBucketName()

  const params = {
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }

  // Use multipart upload for files > 5MB
  if (buffer.length > 5 * 1024 * 1024) {
    const upload = new Upload({
      client,
      params,
    })
    await upload.done()
  } else {
    await client.send(new PutObjectCommand(params))
  }

  return getS3Url(key)
}

// Allowed hosts for fetching media (SSRF protection)
const ALLOWED_FETCH_HOSTS = [
  's3.us-west-2.amazonaws.com',
  'prod-files-secure.s3.us-west-2.amazonaws.com', // Notion's S3
  'res.cloudinary.com', // For migration
  'image.mux.com', // Mux thumbnails
]

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_FETCH_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    )
  } catch {
    return false
  }
}

async function fetchAsBuffer(url: string): Promise<Buffer> {
  if (!isAllowedUrl(url)) {
    throw new Error(`Fetch blocked: untrusted host in URL`)
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    avif: 'image/avif',
    svg: 'image/svg+xml',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
  }
  return mimeTypes[ext || ''] || 'application/octet-stream'
}

const FOLDER = 'media'

export const s3Provider: MediaProvider = {
  name: 's3',

  async uploadImage(
    sourceUrl: string,
    filename: string
  ): Promise<UploadResult> {
    const publicId = filename.replace(/\.[^.]+$/, '')
    const key = `${FOLDER}/${filename}`

    // Check if already exists (deduplication)
    if (await objectExists(key)) {
      console.log(`[S3] Image already exists: ${key}`)
      return {
        url: getS3Url(key),
        publicId,
      }
    }

    // Download from source and upload to S3
    console.log(`[S3] Uploading image: ${key}`)
    const buffer = await fetchAsBuffer(sourceUrl)
    const contentType = getContentType(filename)
    const url = await uploadBuffer(buffer, key, contentType)

    return { url, publicId }
  },

  async uploadVideo(
    sourceUrl: string,
    filename: string
  ): Promise<VideoUploadResult> {
    const publicId = filename.replace(/\.[^.]+$/, '')
    const videoKey = `${FOLDER}/${filename}`
    const posterKey = `${FOLDER}/${publicId}-poster.jpg`

    // Check existing assets
    const videoExists = await objectExists(videoKey)
    const posterExists = await objectExists(posterKey)

    if (videoExists && posterExists) {
      console.log(`[S3] Video and poster already exist: ${videoKey}`)
      return {
        url: getS3Url(videoKey),
        poster: getS3Url(posterKey),
        publicId,
      }
    }

    // Download video
    console.log(`[S3] Downloading video: ${filename}`)
    const videoBuffer = await fetchAsBuffer(sourceUrl)

    // Upload video if not exists
    if (!videoExists) {
      console.log(`[S3] Uploading video: ${videoKey}`)
      const contentType = getContentType(filename)
      await uploadBuffer(videoBuffer, videoKey, contentType)
    }

    // Generate and upload poster if not exists
    let posterUrl: string | undefined
    if (!posterExists) {
      try {
        console.log(`[S3] Generating poster for: ${videoKey}`)
        const posterBuffer = await generatePosterFromVideo(videoBuffer)
        posterUrl = await uploadBuffer(posterBuffer, posterKey, 'image/jpeg')
        console.log(`[S3] Poster uploaded: ${posterKey}`)
      } catch (error) {
        console.error('[S3] Failed to generate poster:', error)
        // Continue without poster - video still works
      }
    } else {
      posterUrl = getS3Url(posterKey)
    }

    return {
      url: getS3Url(videoKey),
      poster: posterUrl,
      publicId,
    }
  },

  getOptimizedUrl(baseUrl: string, _options: TransformOptions = {}): string {
    // S3 doesn't support on-the-fly transformations
    // Vercel's Image Optimization handles this via next/image
    // For direct URLs, return as-is with proper caching
    return baseUrl
  },
}
