import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

let ffmpeg: FFmpeg | null = null
let loadPromise: Promise<FFmpeg> | null = null

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg?.loaded) return ffmpeg

  // Prevent multiple simultaneous loads
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    ffmpeg = new FFmpeg()

    // Load ffmpeg WASM from CDN
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm'
      ),
    })

    return ffmpeg
  })()

  return loadPromise
}

/**
 * Extract first frame from video as JPEG poster
 * Uses WASM-based ffmpeg for portability (works on Vercel serverless)
 *
 * @param videoBuffer - Video file as Buffer
 * @returns JPEG image as Buffer
 */
export async function generatePosterFromVideo(
  videoBuffer: Buffer
): Promise<Buffer> {
  const ff = await getFFmpeg()

  const inputName = `input-${Date.now()}.mp4`
  const outputName = `poster-${Date.now()}.jpg`

  try {
    // Write video to virtual filesystem
    await ff.writeFile(inputName, new Uint8Array(videoBuffer))

    // Extract first frame
    // -ss 0 = seek to start
    // -vframes 1 = extract 1 frame
    // -q:v 2 = high quality JPEG (1-31, lower is better)
    // -vf scale=800:-1 = scale to 800px width, maintain aspect ratio
    await ff.exec([
      '-ss',
      '0',
      '-i',
      inputName,
      '-vframes',
      '1',
      '-q:v',
      '2',
      '-vf',
      'scale=800:-1',
      outputName,
    ])

    // Read output
    const data = await ff.readFile(outputName)

    return Buffer.from(data as Uint8Array)
  } finally {
    // Cleanup virtual filesystem (ignore errors if files don't exist)
    await ff.deleteFile(inputName).catch(() => undefined)
    await ff.deleteFile(outputName).catch(() => undefined)
  }
}
