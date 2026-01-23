import type { MediaProvider } from '../types'
import { cloudinaryProvider } from './cloudinary'
import { muxProvider } from './mux'
import { s3Provider } from './s3'

// Provider selection based on MEDIA_PROVIDER env var
// Defaults to cloudinary for backwards compatibility
function getConfiguredProvider(): MediaProvider {
  const provider = process.env.MEDIA_PROVIDER || 'cloudinary'

  switch (provider) {
    case 's3':
      return s3Provider
    case 'mux':
      return muxProvider
    case 'cloudinary':
      return cloudinaryProvider
    default:
      console.warn(
        `[Media] Unknown MEDIA_PROVIDER: ${provider}, defaulting to cloudinary`
      )
      return cloudinaryProvider
  }
}

// Provider configuration - controlled by MEDIA_PROVIDER env var
export const imageProvider: MediaProvider = getConfiguredProvider()
export const videoProvider: MediaProvider = getConfiguredProvider()

export { cloudinaryProvider, muxProvider, s3Provider }
