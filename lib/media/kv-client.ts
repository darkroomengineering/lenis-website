import { kv } from '@vercel/kv'
import type { MediaMapping } from './types'

const KV_PREFIX = 'media:'

export async function getMediaMapping(
  pageId: string,
  fileHash: string
): Promise<MediaMapping | null> {
  const key = `${KV_PREFIX}${pageId}:${fileHash}`
  return kv.get<MediaMapping>(key)
}

export async function setMediaMapping(mapping: MediaMapping): Promise<void> {
  const key = `${KV_PREFIX}${mapping.notionPageId}:${mapping.fileHash}`
  await kv.set(key, mapping, { ex: 60 * 60 * 24 * 30 }) // 30 days TTL
}

export async function getAllMappings(): Promise<MediaMapping[]> {
  const keys = await kv.keys(`${KV_PREFIX}*`)
  if (keys.length === 0) return []
  const values = await kv.mget<MediaMapping[]>(...keys)
  return values.filter((v): v is MediaMapping => v !== null)
}
