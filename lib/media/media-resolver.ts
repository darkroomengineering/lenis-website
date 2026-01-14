import { createHash } from 'node:crypto'
import { getMediaMapping, setMediaMapping } from './kv-client'
import { imageProvider, videoProvider } from './providers'
import type { MediaMapping, NotionFile, ResolvedMedia } from './types'

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

  // Check cache first
  const cached = await getMediaMapping(pageId, fileHash)
  if (cached) {
    return {
      url: cached.url,
      type: cached.type,
      poster: cached.poster,
      playbackId: cached.playbackId,
    }
  }

  // Upload to appropriate provider
  try {
    const provider = mediaType === 'image' ? imageProvider : videoProvider
    const filename = `${pageId}-${fileHash}-${file.name}`

    if (mediaType === 'image') {
      const result = await provider.uploadImage(file.file.url, filename)

      const mapping: MediaMapping = {
        notionPageId: pageId,
        fileHash,
        url: result.url,
        type: 'image',
        provider: 'cloudinary',
        createdAt: new Date().toISOString(),
      }
      await setMediaMapping(mapping)

      return { url: result.url, type: 'image' }
    }
    const result = await provider.uploadVideo(file.file.url, filename)

    const mapping: MediaMapping = {
      notionPageId: pageId,
      fileHash,
      url: result.url,
      type: 'video',
      provider: videoProvider.name as 'cloudinary' | 'mux',
      poster: result.poster,
      playbackId: result.playbackId,
      createdAt: new Date().toISOString(),
    }
    await setMediaMapping(mapping)

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
