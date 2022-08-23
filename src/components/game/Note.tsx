import { Sprite, useTick } from '@inlet/react-pixi'
import { Texture } from 'pixi.js'
import { useState } from 'react'
import { interpolate } from '../../libs/interpolate'
import {
  COL_WIDTH,
  HEIGHT,
  NOTE_HEIGHT,
  NOTE_TRAVEL_DURATION,
  SCROLL_SPEED,
} from '../../libs/options'
import { useAppSelector } from '../../libs/redux/hooks'

type NoteProps = {
  x: number
  startTime: number
}

export default function Note(props: NoteProps) {
  const [y, setY] = useState(0)
  const playStartTime = useAppSelector((state) => state.gameState.playStartTime)
  const isPlaying = useAppSelector((state) => state.gameState.isPlaying)

  useTick(() => {
    if (isPlaying) {
      const currentTime = Date.now() - playStartTime

      setY(
        interpolate(
          currentTime,
          [props.startTime - NOTE_TRAVEL_DURATION, props.startTime],
          [0, 480 + 10]
        )
      )
    }
  })

  return (
    <Sprite
      texture={Texture.WHITE}
      x={props.x}
      y={y}
      anchor={[0.5, 1]}
      width={COL_WIDTH}
      height={NOTE_HEIGHT}
    />
  )
}
