import Mux from '@mux/mux-node'
import type {
  MediaProvider,
  TransformOptions,
  UploadResult,
  VideoUploadResult,
} from '../types'

// Create Mux client lazily to handle missing env vars
function getMuxClient(): Mux {
  const tokenId = process.env.MUX_TOKEN_ID
  const tokenSecret = process.env.MUX_TOKEN_SECRET

  if (!(tokenId && tokenSecret)) {
    throw new Error(
      'Missing Mux configuration. Set MUX_TOKEN_ID and MUX_TOKEN_SECRET.'
    )
  }

  return new Mux({ tokenId, tokenSecret })
}

export const muxProvider: MediaProvider = {
  name: 'mux',

  async uploadImage(): Promise<UploadResult> {
    throw new Error('Mux does not handle images - use Cloudinary')
  },

  async uploadVideo(
    sourceUrl: string,
    _filename: string
  ): Promise<VideoUploadResult> {
    const mux = getMuxClient()
    // Create asset from URL
    const asset = await mux.video.assets.create({
      inputs: [{ url: sourceUrl }],
      playback_policy: ['public'],
      encoding_tier: 'baseline', // Free tier friendly
    })

    // Wait for asset to be ready (or handle async via webhook)
    // For simplicity, we'll poll briefly
    let readyAsset = asset
    let attempts = 0
    while (readyAsset.status !== 'ready' && attempts < 30) {
      await new Promise((r) => setTimeout(r, 2000))
      readyAsset = await mux.video.assets.retrieve(asset.id)
      attempts++
    }

    const playbackId = readyAsset.playback_ids?.[0]?.id

    if (!playbackId) {
      throw new Error('Failed to get Mux playback ID')
    }

    return {
      url: `https://stream.mux.com/${playbackId}.m3u8`,
      playbackId,
      poster: `https://image.mux.com/${playbackId}/thumbnail.jpg`,
      publicId: asset.id,
    }
  },

  getOptimizedUrl(baseUrl: string, _options: TransformOptions = {}): string {
    // Mux URLs are already optimized via HLS
    return baseUrl
  },
}
