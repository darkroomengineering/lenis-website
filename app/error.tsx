'use client'

import { useEffect } from 'react'
import { Button } from '@/components/button'
import { Link } from '@/components/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center px-4"
      data-theme="dark"
    >
      <div className="max-w-md text-center">
        <h1 className="h2 mb-4">Something went wrong</h1>
        <p className="p mb-6 text-[var(--theme-secondary)]">
          We're sorry, but something unexpected happened. Please try again.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-[var(--theme-secondary-50)] text-sm hover:text-[var(--theme-secondary)]">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-[var(--theme-secondary-10)] p-4 text-xs">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={reset}>Try Again</Button>
          <Link
            href="/"
            className="rounded border border-[var(--theme-secondary-20)] px-6 py-3 transition-colors hover:bg-[var(--theme-secondary-10)]"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
