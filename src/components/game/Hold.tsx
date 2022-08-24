import { Container, Sprite, useTick } from '@inlet/react-pixi'
// webhook test
import { Texture } from 'pixi.js'
import { useState } from 'react'
import { interpolate } from '../../libs/interpolate'
import {
  OFFSET,
  COL_WIDTH,
  HOLD_WIDTH,
  NOTE_HEIGHT,
  NOTE_TRAVEL_DURATION,
  NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
  SCROLL_SPEED,
} from '../../libs/options'
import { useAppSelector } from '../../libs/redux/hooks'
import { TimingPoint } from '../../types/TimingPoint'
import { HitObject } from '../../types/HitObject'

type HoldProps = {
  x: number
  startTime: number
  endTime: number
  timingPoint: TimingPoint
}
// function HitEffect(hitobject : HitObject){
//   if (hitobject.startTime == props.startTime && hitobject.column == props.x){
//     console.log("effect on ", hitobject)
//   }
// }
export default function Hold(props: HoldProps) {
  const playStartTime = useAppSelector((state) => state.gameState.playStartTime)
  const isPlaying = useAppSelector((state) => state.gameState.isPlaying)
  const holdDuration = props.endTime - props.startTime
  const height = Math.round((holdDuration * SCROLL_SPEED) / 1000)
  const [y, setY] = useState(-height)
  // const hitted = 
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
            props.endTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
          ],
          [-height, 480]
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
