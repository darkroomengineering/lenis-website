import type { MediaProvider } from '../types'
import { cloudinaryProvider } from './cloudinary'
import { muxProvider } from './mux'

// Provider configuration - easy to change later
export const imageProvider: MediaProvider = cloudinaryProvider
export const videoProvider: MediaProvider = muxProvider // Swap to cloudinaryProvider when needed

export { cloudinaryProvider, muxProvider }
