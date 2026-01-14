import { Client } from '@notionhq/client'
import type { Metadata } from 'next'
import ShowcaseClient from './client'

export const metadata: Metadata = {
  title: 'Lenis – Get smooth or die trying',
  description: 'A showcase of neat Lenis implementations',
}

// ISR: revalidate every 30 minutes
export const revalidate = 1800

async function getShowcaseData() {
  // Return empty results if NOTION_TOKEN is not configured
  if (!process.env.NOTION_TOKEN) {
    console.warn('NOTION_TOKEN not configured, returning empty showcase')
    return { results: [] }
  }

  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    })
    const database = await notion.dataSources.query({
      data_source_id: '2c0e97ae-01cf-80a8-aa3c-000b46741671',
      filter: {
        property: 'status',
        status: {
          equals: 'Published',
        },
      },
    })
    return database
  } catch (error) {
    console.error('Failed to fetch showcase data:', error)
    return { results: [] }
  }
}

export default async function ShowcasePage() {
  const database = await getShowcaseData()
  // Type assertion needed due to Notion SDK's complex union types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ShowcaseClient database={database as any} />
}
