import { Container, Sprite, useTick } from '@inlet/react-pixi'
import { Texture } from 'pixi.js'
import { useState } from 'react'
import { interpolate } from '../../libs/interpolate'
import {
  COL_WIDTH,
  HEIGHT,
  HOLD_WIDTH,
  NOTE_HEIGHT,
  NOTE_TRAVEL_DURATION,
  SCROLL_SPEED,
} from '../../libs/options'
import { useAppSelector } from '../../libs/redux/hooks'
import { TimingPoint } from '../../types/TimingPoint'

type HoldProps = {
  x: number
  startTime: number
  endTime: number
  timingPoint: TimingPoint
}

export default function Hold(props: HoldProps) {
  const [y, setY] = useState(0)
  const playStartTime = useAppSelector((state) => state.gameState.playStartTime)
  const isPlaying = useAppSelector((state) => state.gameState.isPlaying)

  const holdDuration = props.endTime - props.startTime
  const beatDuration = 60000 / props.timingPoint.bpm
  const holdBeats = holdDuration / beatDuration
  // 1 beat takes a full screen height
  const height = HEIGHT * holdBeats + NOTE_HEIGHT

  useTick(() => {
    if (isPlaying) {
      const currentTime = Date.now() - playStartTime
      setY(
        interpolate(
          currentTime,
          [props.startTime - NOTE_TRAVEL_DURATION, props.startTime],
          [0, 480 + NOTE_HEIGHT]
        )
      )
      console.log(currentTime, props.startTime)
    }
  })

  return (
    <Container>
      <Sprite
        texture={Texture.WHITE}
        x={props.x}
        y={y}
        anchor={[0.5, 1]}
        width={COL_WIDTH}
        height={NOTE_HEIGHT}
      />

      <Sprite
        texture={Texture.WHITE}
        x={props.x}
        y={y - NOTE_HEIGHT}
        anchor={[0.5, 1]}
        width={HOLD_WIDTH}
        height={height}
      />

      <Sprite
        texture={Texture.WHITE}
        x={props.x}
        y={y - height}
        anchor={[0.5, 1]}
        width={COL_WIDTH}
        height={NOTE_HEIGHT}
      />
    </Container>
  )
}
