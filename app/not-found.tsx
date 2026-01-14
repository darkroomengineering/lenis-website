import { Button } from '@/components/button'

export default function NotFound() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center px-4"
      data-theme="dark"
    >
      <div className="max-w-md text-center">
        <h1 className="h1 mb-4">404</h1>
        <p className="h4 mb-2">Page Not Found</p>
        <p className="mb-8 p-s text-[var(--theme-secondary-50)]">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex justify-center gap-4">
          <Button href="/">Go Home</Button>
        </div>
      </div>
    </div>
  )
}
