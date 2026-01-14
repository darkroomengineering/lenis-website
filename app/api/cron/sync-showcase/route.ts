import { Client } from '@notionhq/client'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import type { NotionFile } from '@/lib/media'
import { resolveMedia } from '@/lib/media'

export const runtime = 'nodejs'
export const maxDuration = 60

const DATA_SOURCE_ID = '2c0e97ae-01cf-80a8-aa3c-000b46741671'

interface NotionEntry {
  id: string
  properties?: {
    title?: {
      rich_text?: { plain_text: string }[]
    }
    thumbnail?: {
      files?: NotionFile[]
    }
  }
}

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.NOTION_TOKEN) {
    return NextResponse.json(
      { error: 'NOTION_TOKEN not configured' },
      { status: 500 }
    )
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN })

    // Note: Notion SDK v5+ uses dataSources.query instead of databases.query
    const database = await notion.dataSources.query({
      data_source_id: DATA_SOURCE_ID,
      filter: {
        property: 'status',
        status: { equals: 'Published' },
      },
    })

    const results = {
      processed: 0,
      cached: 0,
      failed: 0,
      entries: [] as { id: string; title: string; status: string }[],
    }

    // Process entries with concurrency limit
    const CONCURRENCY = 3
    const entries = database.results as NotionEntry[]

    for (let i = 0; i < entries.length; i += CONCURRENCY) {
      const batch = entries.slice(i, i + CONCURRENCY)

      await Promise.all(
        batch.map(async (entry: NotionEntry) => {
          const title =
            entry.properties?.title?.rich_text?.[0]?.plain_text ?? 'Untitled'
          const file = entry.properties?.thumbnail?.files?.[0]

          if (!file?.file?.url) {
            results.entries.push({ id: entry.id, title, status: 'skipped' })
            return
          }

          try {
            const media = await resolveMedia(entry.id, file)
            if (media) {
              // Check if it was cached vs new upload by URL pattern
              const wasCached = !media.url.includes('notion')
              if (wasCached) {
                results.cached++
              } else {
                results.processed++
              }
              results.entries.push({ id: entry.id, title, status: 'ok' })
            }
          } catch {
            results.failed++
            results.entries.push({ id: entry.id, title, status: 'failed' })
          }
        })
      )
    }

    // Revalidate if any new media was processed
    if (results.processed > 0) {
      revalidatePath('/showcase')
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    })
  } catch (error) {
    console.error('Cron sync failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
