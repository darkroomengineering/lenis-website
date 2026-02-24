'use client'

import cn from 'clsx'
import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface NewsletterProps {
  className?: string
}

export function Newsletter({ className }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setStatus('success')
      setMessage('Thanks for subscribing!')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <form
      className={cn(
        'dr-rounded-32 dr-h-48 dr-pl-16 dt:dr-pl-20 relative flex items-center overflow-hidden border border-[#8c8c8c] transition-[border-color] duration-300 ease-out-expo focus-within:border-secondary',
        className
      )}
      onSubmit={handleSubmit}
    >
      {status === 'success' ? (
        <p className="dr-px-16 dt:dr-px-20 w-full text-center">{message}</p>
      ) : (
        <>
          <input
            className="h-full min-w-0 flex-1 border-none bg-transparent font-[inherit] text-inherit outline-none placeholder:text-inherit placeholder:opacity-50 disabled:opacity-50"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            disabled={status === 'loading'}
            required
          />
          <button
            className="dr-px-16 dt:dr-px-20 h-full cursor-pointer whitespace-nowrap border-none bg-[var(--theme-contrast)] font-[inherit] text-[var(--theme-primary)] transition-opacity duration-300 ease-out-expo hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Subscribe'}
          </button>
        </>
      )}
      {status === 'error' && (
        <p className="-dr-bottom-20 dt:-dr-bottom-24 dr-left-16 dt:dr-left-20 dr-text-12 absolute text-[#ff4444]">
          {message}
        </p>
      )}
    </form>
  )
}
