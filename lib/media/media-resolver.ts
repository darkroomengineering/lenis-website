import { createHash } from 'node:crypto'
import { imageProvider, videoProvider } from './providers'
import type { NotionFile, ResolvedMedia } from './types'

function generateFileHash(file: NotionFile): string {
  return createHash('md5').update(file.name).digest('hex').slice(0, 12)
}

function getMediaType(filename: string): 'image' | 'video' {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv']
  return videoExtensions.includes(ext) ? 'video' : 'image'
}

export async function resolveMedia(
  pageId: string,
  file: NotionFile
): Promise<ResolvedMedia | null> {
  if (!file.file?.url) return null

  const fileHash = generateFileHash(file)
  const mediaType = getMediaType(file.name)
  const filename = `${pageId}-${fileHash}-${file.name}`

  try {
    if (mediaType === 'image') {
      // Cloudinary handles caching internally - checks if exists before uploading
      const result = await imageProvider.uploadImage(file.file.url, filename)
      return { url: result.url, type: 'image' }
    }

    // Video - use configured video provider (Mux or Cloudinary)
    const result = await videoProvider.uploadVideo(file.file.url, filename)
    return {
      url: result.url,
      type: 'video',
      poster: result.poster,
      playbackId: result.playbackId,
    }
  } catch (error) {
    console.error(`Failed to resolve media for ${pageId}:`, error)
    // Fallback to original Notion URL
    return {
      url: file.file.url,
      type: mediaType,
    }
  }
}
