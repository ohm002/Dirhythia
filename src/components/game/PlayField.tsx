import { useEffect } from 'react'
import Column from './Column'

export default function PlayField() {
  useEffect(() => {
    const handleRetry = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'F5':
          e.preventDefault()

          // retry logic
          break
      }
    }

    document.addEventListener('keydown', handleRetry)

    return () => {
      document.removeEventListener('keydown', handleRetry)
    }
  })

  return (
    <>
      <Column />
      <Column />
      <Column />
      <Column />
    </>
  )
}
