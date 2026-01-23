import { timingSafeEqual } from 'node:crypto'
import { Client } from '@notionhq/client'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import type { NotionFile } from '@/lib/media'
import { resolveMedia } from '@/lib/media'

export const runtime = 'nodejs'
export const maxDuration = 30

function verifyWebhookSecret(request: Request): boolean {
  const secret = process.env.NOTION_WEBHOOK_SECRET
  if (!secret) return false // Require secret to be configured

  const authHeader = request.headers.get('authorization') || ''
  const providedToken = authHeader.replace('Bearer ', '')

  if (providedToken.length !== secret.length) return false

  try {
    return timingSafeEqual(Buffer.from(providedToken), Buffer.from(secret))
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  // Verify webhook secret to prevent unauthorized access
  if (!verifyWebhookSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await request.json()

    // Notion webhooks send page_id for updates
    const pageId = payload?.data?.page_id || payload?.page?.id

    if (!pageId) {
      return NextResponse.json({
        received: true,
        processed: false,
        reason: 'no page_id',
      })
    }

    if (!process.env.NOTION_TOKEN) {
      return NextResponse.json(
        { error: 'NOTION_TOKEN not configured' },
        { status: 500 }
      )
    }

    const notion = new Client({ auth: process.env.NOTION_TOKEN })
    const page = await notion.pages.retrieve({ page_id: pageId })
    const properties = (page as Record<string, unknown>).properties as Record<
      string,
      unknown
    >

    // Check if published
    const statusProp = properties?.status as Record<string, unknown> | undefined
    const status = (statusProp?.status as Record<string, string> | undefined)
      ?.name
    if (status !== 'Published') {
      return NextResponse.json({
        received: true,
        processed: false,
        reason: 'not published',
      })
    }

    const thumbnailProp = properties?.thumbnail as
      | Record<string, unknown>
      | undefined
    const files = thumbnailProp?.files as NotionFile[] | undefined
    const file = files?.[0]
    if (file?.file?.url) {
      await resolveMedia(pageId, file)
      revalidatePath('/showcase')
    }

    return NextResponse.json({ received: true, processed: true, pageId })
  } catch (error) {
    console.error('Webhook failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    )
  }
}

// Also handle GET for webhook verification (some services require this)
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'notion-webhook' })
}
