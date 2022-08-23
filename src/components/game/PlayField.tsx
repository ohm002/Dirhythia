import { useEffect } from 'react'
import Column from './Column'

export default function PlayField() {
  useEffect(() => {
    const handleRetry = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'F5':
          e.preventDefault()

          // retry logic
          // stop eventlistener in  each column
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
    // cursor logic
    <Container x={400}>
      <Column i={0}/>
      <Column i={1}/>
      <Column i={2}/>
      <Column i={3}/>
      </Container>
    </>
  )
}
