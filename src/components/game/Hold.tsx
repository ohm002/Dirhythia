import { Container, Sprite, useTick } from '@inlet/react-pixi'
import { Texture } from 'pixi.js'
import { useState } from 'react'
import { interpolate } from '../../libs/interpolate'
import {
  COL_WIDTH,
  HOLD_WIDTH,
  NOTE_HEIGHT,
  NOTE_TRAVEL_DURATION,
  NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION, OFFSET, SCROLL_SPEED
} from '../../libs/options'
import { GameState } from '../../state/GameState'
import { TimingPoint } from '../../types/TimingPoint'

type HoldProps = {
  x: number
  startTime: number
  endTime: number
  timingPoint: TimingPoint
  game: GameState
  keys: number
}
export default function Hold(props: HoldProps) {
  let holdDuration = props.endTime - props.startTime
  const height = Math.round((holdDuration * SCROLL_SPEED) / 1000)
  const [y, setY] = useState(-height)
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
            props.endTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION + OFFSET,
          ],
          [-height, 480]
        )
      )
      // if ()
      setAlpha(
        interpolate(
          currentTime,
          [
            props.endTime + OFFSET,
            props.endTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION + OFFSET,
          ],
          [1, 0]
        )
      )
    }
  })

  return (
    <Container alpha={alpha}>
      <Sprite
        texture={Texture.WHITE}
        x={props.x}
        y={y + height}
        anchor={[0.5, 1]}
        width={HOLD_WIDTH}
        height={height + NOTE_HEIGHT}
      />

      {/* <Sprite
        texture={Texture.WHITE}
        tint={0x000000}
        x={props.x}
        y={y + height+20}
        anchor={[0.5, 1]}
        width={1}
        height={height-20 }
      /> */}
      <Sprite
        texture={Texture.WHITE}
        x={props.x}
        y={y + height}
        anchor={[0.5, 1]}
        width={COL_WIDTH}
        height={NOTE_HEIGHT}
      />
    </Container>
  )
}
