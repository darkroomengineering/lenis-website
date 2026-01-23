export interface MediaMapping {
  notionPageId: string
  fileHash: string
  url: string // CDN URL (Cloudinary or Mux)
  type: 'image' | 'video'
  provider: 'cloudinary' | 'mux' | 's3'
  poster?: string | undefined // For videos
  playbackId?: string | undefined // For Mux
  createdAt: string
}

export interface NotionFile {
  file?: { url: string }
  name: string
}

export interface ResolvedMedia {
  url: string
  type: 'image' | 'video'
  poster?: string | undefined
  playbackId?: string | undefined // Mux-specific, optional
}

// Provider interface - key for swappability
export interface MediaProvider {
  name: string
  uploadImage(sourceUrl: string, filename: string): Promise<UploadResult>
  uploadVideo(sourceUrl: string, filename: string): Promise<VideoUploadResult>
  getOptimizedUrl(baseUrl: string, options?: TransformOptions): string
}

export interface UploadResult {
  url: string
  publicId: string
}

export interface VideoUploadResult {
  url: string
  playbackId?: string | undefined
  poster?: string | undefined
  publicId: string
}

export interface TransformOptions {
  width?: number | undefined
  height?: number | undefined
  quality?: 'auto' | number | undefined
  format?: 'auto' | 'webp' | 'avif' | undefined
}
