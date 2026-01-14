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

export const cloudinaryProvider: MediaProvider = {
  name: 'cloudinary',

  async uploadImage(
    sourceUrl: string,
    filename: string
  ): Promise<UploadResult> {
    getCloudinaryConfig()
    const result = await cloudinary.uploader.upload(sourceUrl, {
      folder: 'lenis-showcase',
      public_id: filename.replace(/\.[^.]+$/, ''), // Remove extension
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
    const result = await cloudinary.uploader.upload(sourceUrl, {
      folder: 'lenis-showcase',
      public_id: filename.replace(/\.[^.]+$/, ''),
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
    // Extract public ID from Cloudinary URL and rebuild with transforms
    const { width, height, quality = 'auto', format = 'auto' } = options

    // If it's already a Cloudinary URL, we can transform it
    if (baseUrl.includes('cloudinary.com')) {
      // Simple approach: append transformations
      const transforms = []
      if (width) transforms.push(`w_${width}`)
      if (height) transforms.push(`h_${height}`)
      transforms.push(`q_${quality}`)
      transforms.push(`f_${format}`)

      // Insert transforms before /upload/
      return baseUrl.replace('/upload/', `/upload/${transforms.join(',')}/`)
    }
    return baseUrl
  },
}
