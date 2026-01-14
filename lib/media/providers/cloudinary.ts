import { v2 as cloudinary } from 'cloudinary'
import type {
  MediaProvider,
  TransformOptions,
  UploadResult,
  VideoUploadResult,
} from '../types'

// Configure lazily to avoid issues with missing env vars at import time
function getCloudinaryConfig() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
  const api_key = process.env.CLOUDINARY_API_KEY
  const api_secret = process.env.CLOUDINARY_API_SECRET

  if (!(cloud_name && api_key && api_secret)) {
    throw new Error(
      'Missing Cloudinary configuration. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
    )
  }

  cloudinary.config({ cloud_name, api_key, api_secret })
}

const FOLDER = 'lenis-showcase'

// Check if a resource already exists in Cloudinary
export async function getExistingResource(
  publicId: string,
  resourceType: 'image' | 'video'
): Promise<{ url: string; poster?: string } | null> {
  getCloudinaryConfig()
  try {
    const result = await cloudinary.api.resource(`${FOLDER}/${publicId}`, {
      resource_type: resourceType,
    })

    if (resourceType === 'video') {
      const posterUrl = cloudinary.url(result.public_id, {
        resource_type: 'video',
        format: 'jpg',
        transformation: [
          { width: 800, crop: 'limit' },
          { quality: 'auto' },
          { start_offset: '0' },
        ],
      })
      return { url: result.secure_url, poster: posterUrl }
    }

    return { url: result.secure_url }
  } catch {
    // Resource doesn't exist
    return null
  }
}

export const cloudinaryProvider: MediaProvider = {
  name: 'cloudinary',

  async uploadImage(
    sourceUrl: string,
    filename: string
  ): Promise<UploadResult> {
    getCloudinaryConfig()
    const publicId = filename.replace(/\.[^.]+$/, '') // Remove extension

    // Check if already exists
    const existing = await getExistingResource(publicId, 'image')
    if (existing) {
      return {
        url: existing.url,
        publicId: `${FOLDER}/${publicId}`,
      }
    }

    // Upload new
    const result = await cloudinary.uploader.upload(sourceUrl, {
      folder: FOLDER,
      public_id: publicId,
      resource_type: 'image',
      overwrite: false,
      unique_filename: false,
    })
    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  },

  async uploadVideo(
    sourceUrl: string,
    filename: string
  ): Promise<VideoUploadResult> {
    getCloudinaryConfig()
    const publicId = filename.replace(/\.[^.]+$/, '')

    // Check if already exists
    const existing = await getExistingResource(publicId, 'video')
    if (existing) {
      return {
        url: existing.url,
        poster: existing.poster,
        publicId: `${FOLDER}/${publicId}`,
      }
    }

    // Upload new
    const result = await cloudinary.uploader.upload(sourceUrl, {
      folder: FOLDER,
      public_id: publicId,
      resource_type: 'video',
      overwrite: false,
      unique_filename: false,
    })

    // Generate poster from first frame
    const posterUrl = cloudinary.url(result.public_id, {
      resource_type: 'video',
      format: 'jpg',
      transformation: [
        { width: 800, crop: 'limit' },
        { quality: 'auto' },
        { start_offset: '0' },
      ],
    })

    return {
      url: result.secure_url,
      poster: posterUrl,
      publicId: result.public_id,
    }
  },

  getOptimizedUrl(baseUrl: string, options: TransformOptions = {}): string {
    const { width, height, quality = 'auto', format = 'auto' } = options

    if (baseUrl.includes('cloudinary.com')) {
      const transforms = []
      if (width) transforms.push(`w_${width}`)
      if (height) transforms.push(`h_${height}`)
      transforms.push(`q_${quality}`)
      transforms.push(`f_${format}`)

      return baseUrl.replace('/upload/', `/upload/${transforms.join(',')}/`)
    }
    return baseUrl
  },
}
