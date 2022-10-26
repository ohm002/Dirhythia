import { Container, Sprite, useTick } from '@inlet/react-pixi'
import { BLEND_MODES, Texture } from 'pixi.js'
import { useState } from 'react'
import note from '../../assets/note.png'
import { interpolate } from '../../libs/interpolate'
import {
  COLCOLOR,
  COL_WIDTH,
  HEIGHT,
  HOLD_WIDTH, NOTE_HEIGHT,
  NOTE_TRAVEL_DURATION,
  NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION, SCROLL_SPEED
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
  let color = COLCOLOR[props.keys-1]


  useTick(() => {
    let isPlaying = props.game.isPlaying
      if (isPlaying) {
        const currentTime = props.game.currenttime
      setY(
        interpolate(
          currentTime,
          [
            props.startTime -
              NOTE_TRAVEL_DURATION +
              NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
            props.endTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
          ],
          [-height, HEIGHT]
        )
      )
      // if ()
      setAlpha(
        interpolate(
          currentTime,
          [
            props.endTime,
            props.endTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
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
        tint={color}
        alpha={0.5}
        anchor={[0.5, 1]}
        blendMode={BLEND_MODES.ADD}
        width={HOLD_WIDTH}
        height={height + NOTE_HEIGHT}
      />

      <Sprite
      image={note}
        x={props.x}
        y={y + height}
        tint={color}
        anchor={[0.5, 1]}
        width={COL_WIDTH}
        height={NOTE_HEIGHT}
        alpha={alpha}
      />
    </Container>
  )
}
