/**
 * Invalidate S3 media cache by deleting objects so they get re-synced from Notion.
 *
 * Usage:
 *   bun run scripts/invalidate-s3.ts <filename>
 *   bun run scripts/invalidate-s3.ts --all         # delete all media objects
 *   bun run scripts/invalidate-s3.ts --list        # list all media objects (dry run)
 *
 * Examples:
 *   bun run scripts/invalidate-s3.ts my-video.mp4
 *   bun run scripts/invalidate-s3.ts my-video-poster.jpg
 *   bun run scripts/invalidate-s3.ts --all
 *
 * Required env vars:
 *   - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
 *   - S3_BUCKET_NAME
 */

import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3'

const bucket = process.env.S3_BUCKET_NAME

if (!bucket) {
  console.error('Missing S3_BUCKET_NAME env var')
  process.exit(1)
}

const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

if (!(accessKeyId && secretAccessKey)) {
  console.error('Missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY env vars')
  process.exit(1)
}

const arg = process.argv[2]

if (!arg) {
  console.error('Usage: bun run scripts/invalidate-s3.ts <filename>')
  console.error('       bun run scripts/invalidate-s3.ts --all')
  console.error('       bun run scripts/invalidate-s3.ts --list')
  process.exit(1)
}

const region = process.env.AWS_REGION || 'us-east-1'
const client = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
})

const FOLDER = 'media'

async function listObjects(): Promise<{ Key: string; Size: number }[]> {
  const objects: { Key: string; Size: number }[] = []
  let continuationToken: string | undefined

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: `${FOLDER}/`,
        ContinuationToken: continuationToken,
      })
    )

    for (const obj of response.Contents ?? []) {
      if (obj.Key && obj.Size !== undefined) {
        objects.push({ Key: obj.Key, Size: obj.Size })
      }
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined
  } while (continuationToken)

  return objects
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

if (arg === '--list') {
  const objects = await listObjects()
  console.log(`Found ${objects.length} objects in s3://${bucket}/${FOLDER}/\n`)
  for (const obj of objects) {
    console.log(`  ${obj.Key}  (${formatSize(obj.Size)})`)
  }
  process.exit(0)
}

if (arg === '--all') {
  const objects = await listObjects()

  if (objects.length === 0) {
    console.log('No objects found.')
    process.exit(0)
  }

  console.log(
    `Deleting ${objects.length} objects from s3://${bucket}/${FOLDER}/...`
  )

  // DeleteObjects supports up to 1000 keys per request
  const batchSize = 1000
  for (let i = 0; i < objects.length; i += batchSize) {
    const batch = objects.slice(i, i + batchSize)
    await client.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: batch.map((obj) => ({ Key: obj.Key })),
        },
      })
    )
    console.log(
      `  Deleted batch ${Math.floor(i / batchSize) + 1} (${batch.length} objects)`
    )
  }

  console.log(`\nDone. ${objects.length} objects deleted.`)
  console.log('Objects will be re-synced from Notion on the next cron run.')
  process.exit(0)
}

// Single file deletion
const key = arg.startsWith(`${FOLDER}/`) ? arg : `${FOLDER}/${arg}`

console.log(`Deleting: s3://${bucket}/${key}`)

await client.send(
  new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  })
)

console.log(
  'Deleted. Object will be re-synced from Notion on the next cron run.'
)
