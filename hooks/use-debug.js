import { useEffect, useState } from 'react'

export function useDebug() {
  const [debug, setDebug] = useState(false)

  useEffect(() => {
    // Check URL for debug param
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('debug') === 'true') {
        setDebug(true)
      }
    }

    // Toggle debug with Ctrl/Cmd + O
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault()
        setDebug((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return debug
}
