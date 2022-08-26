import { Sprite, useTick } from '@inlet/react-pixi'
import { Texture } from 'pixi.js'
import { useState } from 'react'
import { interpolate } from '../../libs/interpolate'
import {
  COL_WIDTH,
  NOTE_HEIGHT,
  NOTE_TRAVEL_DURATION,
  NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION, OFFSET
} from '../../libs/options'
import { GameState } from '../../state/GameState'

type NoteProps = {
  x: number
  startTime: number
  game: GameState
}

export default function Note(props: NoteProps) {
  const [y, setY] = useState(0)
  const [alpha, setAlpha] = useState(1)

  useTick(() => {
    let playStartTime = props.game.playStartTime
    let isPlaying = props.game.isPlaying
    if (isPlaying) {
      const currentTime = Date.now() - playStartTime + OFFSET

      setY(
        interpolate(
          currentTime,
          [
            props.startTime -
              NOTE_TRAVEL_DURATION +
              NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION +
              OFFSET,
            props.startTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION + OFFSET,
          ],
          [0, 480]
        )
      )

      setAlpha(
        interpolate(
          currentTime,
          [
            // 100 will be changed to the time od expires
            props.startTime + 50 + OFFSET,
            props.startTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION + OFFSET,
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
