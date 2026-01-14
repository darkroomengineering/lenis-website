'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: '#000',
            color: '#fff',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              Critical Error
            </h1>
            <p style={{ marginBottom: '1.5rem', color: '#888' }}>
              A critical error occurred. Please refresh the page or contact
              support if the problem persists.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <summary
                  style={{
                    cursor: 'pointer',
                    color: '#666',
                    fontSize: '0.875rem',
                  }}
                >
                  Error Details (Development Only)
                </summary>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    overflow: 'auto',
                    borderRadius: '0.25rem',
                    backgroundColor: '#111',
                    padding: '1rem',
                    fontSize: '0.75rem',
                  }}
                >
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}

            <div
              style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
            >
              <button
                onClick={reset}
                type="button"
                style={{
                  borderRadius: '0.25rem',
                  backgroundColor: '#fff',
                  color: '#000',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  window.location.href = '/'
                }}
                type="button"
                style={{
                  borderRadius: '0.25rem',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #333',
                  cursor: 'pointer',
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
