import { Client } from '@notionhq/client'
import { NextResponse } from 'next/server'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const DATABASE_ID = process.env.NOTION_NEWSLETTER_DATABASE_ID

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    if (!DATABASE_ID) {
      console.error('NOTION_NEWSLETTER_DATABASE_ID is not set')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        email: {
          title: [
            {
              text: {
                content: email,
              },
            },
          ],
        },
        date: {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
