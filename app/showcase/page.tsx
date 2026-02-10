import { Client } from '@notionhq/client'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { type ResolvedMedia, resolveMedia } from '@/lib/media'
import ShowcaseClient from './client'
import s from './showcase.module.css'

export const metadata: Metadata = {
  title: 'Lenis – Showcase',
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

    // Resolve media URLs in parallel
    const resultsWithMedia = await Promise.all(
      database.results.map(async (result: any) => {
        const file = result.properties?.thumbnail?.files?.[0]
        let resolvedMedia: ResolvedMedia | null = null

        if (file?.file?.url) {
          try {
            resolvedMedia = await resolveMedia(result.id, file)
          } catch (error) {
            console.error(`Failed to resolve media for ${result.id}:`, error)
          }
        }

        return {
          ...result,
          resolvedMedia,
        }
      })
    )

    return { results: resultsWithMedia }
  } catch (error) {
    console.error('Failed to fetch showcase data:', error)
    return { results: [] }
  }
}

function ShowcaseSkeleton() {
  return (
    <div className={s.page} data-theme="dark">
      <div className={s.skeleton}>
        <div className={s.skeletonTitle} />
        <div className={s.skeletonGrid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`skeleton-${i}`} className={s.skeletonCard} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function ShowcasePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; filters?: string }>
}) {
  const { filters } = await searchParams
  const filterParams = filters?.split(',').filter(Boolean) ?? []
  const database = await getShowcaseData()
  return (
    <Suspense fallback={<ShowcaseSkeleton />}>
      <ShowcaseClient
        filters={filterParams}
        database={
          database as unknown as Parameters<
            typeof ShowcaseClient
          >[0]['database']
        }
      />
    </Suspense>
  )
}
