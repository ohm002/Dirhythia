import { Sprite, useTick } from '@inlet/react-pixi'
import { Texture } from 'pixi.js'
import { useState } from 'react'
import { interpolate } from '../../libs/interpolate'
import {
  OFFSET,
  COL_WIDTH,
  NOTE_HEIGHT,
  NOTE_TRAVEL_DURATION,
  NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
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
  const [alpha, setAlpha] = useState(1)

  useTick(() => {
    if (isPlaying) {
      const currentTime = Date.now() - playStartTime + OFFSET

      setY(
        interpolate(
          currentTime,
          [
            props.startTime -
              NOTE_TRAVEL_DURATION +
              NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
            props.startTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
          ],
          [0, 480]
        )
      )
      setAlpha(
        interpolate(
          currentTime,
          [
            // 100 will be changed to the time od expires
            props.startTime + 50,
            props.startTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
          ],
          [1, 0]
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
      alpha={alpha}
    />
  )
}
