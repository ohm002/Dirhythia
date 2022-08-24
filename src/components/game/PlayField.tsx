import { useEffect } from 'react'
import { Sprite } from '@inlet/react-pixi'
import { Beatmap } from '../../types/Beatmap'
import { Texture } from 'pixi.js'
import Column from './Column'
import { WIDTH, JUDGEMENT_LINE_OFFSET_Y, HEIGHT } from '../../libs/options'

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
      <Sprite
        texture={Texture.WHITE}
        width={WIDTH}
        height={1}
        y={HEIGHT - JUDGEMENT_LINE_OFFSET_Y}
      />
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
