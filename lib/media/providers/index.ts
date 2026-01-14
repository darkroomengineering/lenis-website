import type { MediaProvider } from '../types'
import { cloudinaryProvider } from './cloudinary'
import { muxProvider } from './mux'

// Provider configuration - easy to change later
export const imageProvider: MediaProvider = cloudinaryProvider
export const videoProvider: MediaProvider = cloudinaryProvider // Using Cloudinary for videos (Mux free tier limited to 10)

export { cloudinaryProvider, muxProvider }
