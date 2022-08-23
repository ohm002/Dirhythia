import { useEffect } from 'react'
import { Beatmap } from '../../types/Beatmap'
import Column from './Column'

type PlayFieldProps = {
  beatmap: Beatmap
}

export default function PlayField(props: PlayFieldProps) {
  useEffect(() => {
    const handleRetry = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'F5':
          e.preventDefault()

          break
        case '`':
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
      {[...Array(4)].map((_, i) => (
        <Column
          i={i + 1}
          key={i}
          hitObjects={props.beatmap.hitObjects.filter(
            (hitObject) => hitObject.column == i + 1
          )}
          timingPoints={props.beatmap.timingPoints}
        />
      ))}
    </>
  )
}
