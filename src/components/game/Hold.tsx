import { Container, Sprite, useTick } from '@inlet/react-pixi'
import { BLEND_MODES, Texture } from 'pixi.js'
import { useState } from 'react'
import note from '../../assets/note.png'
import hit from '../../assets/hit.png'
import { interpolate } from '../../libs/interpolate'
import {
  COLCOLOR,
  COL_WIDTH,
  CURSOR_AREA,
  HEIGHT,
  HOLD_WIDTH,
  JUDGEMENT_LINE_OFFSET_Y,
  NOTE_HEIGHT,
  NOTE_TRAVEL_DURATION,
  NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
  SCROLL_SPEED,
  WIDTH,
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
  const [holdfade, setHoldfade] = useState(0.5)
  const [clicktime, setclicktime] = useState(-1)
  const [effalpha, setEffAlpha] = useState(0)
  const [clicked, setclicked] = useState('')

  const [cursorx, setcursorx] = useState(
    WIDTH / 2 - CURSOR_AREA / 2 + 0.5 * CURSOR_AREA
  )
  let color = COLCOLOR[props.keys - 1]
  useTick(() => {
    let isPlaying = props.game.isPlaying
    if (isPlaying) {
      const currentTime = props.game.currenttime
      if (props.game.beatmap.cursor.length > 0) {
        let depth = -1
        for (let w = 0; w < props.game.beatmap.cursor.length; w++) {
          const element = props.game.beatmap.cursor[w]
          if (props.startTime < element.startTime) {
            break
          }
          depth++
        }
        if (depth > -1)
          setcursorx(
            WIDTH / 2 -
              CURSOR_AREA / 2 +
              props.game.beatmap.cursor[depth].x * CURSOR_AREA
          )
      }
      if (props.game.hitlist.length > 0) {
        props.game.hitlist.forEach((element: any) => {
          if (
            element.startsWith(
              props.startTime.toString() + props.keys.toString()
            )
          ) {
            if (!element.endsWith('miss') && clicktime == -1 && clicked == '') {
              setclicked('true')
              setclicktime(currentTime)
            } else if (element.endsWith('miss')) {
              setclicked('false')
            }
          }
        })
      }

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
      setAlpha(
        interpolate(
          currentTime,
          [
            props.startTime,
            props.startTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
          ],
          [1, 0]
        )
      )
      if (clicked == 'true') {
        setEffAlpha(
          interpolate(currentTime, [clicktime, clicktime + 500], [1, 0])
        )
        setAlpha(0)
        setHoldfade(1)
      } else if (clicked == 'false') {
        setHoldfade(0.2)
      }
    }
  })

  return (
    <Container>
      <Sprite
        texture={Texture.WHITE}
        x={cursorx - WIDTH / 2 + props.x}
        y={y + height}
        tint={color}
        alpha={holdfade}
        anchor={[0.5, 1]}
        width={HOLD_WIDTH}
        height={height}
      />
      <Sprite
        image={hit}
        x={cursorx - WIDTH / 2 + props.x}
        y={HEIGHT - JUDGEMENT_LINE_OFFSET_Y}
        width={COL_WIDTH * 5}
        height={NOTE_HEIGHT * 3}
        alpha={effalpha}
        blendMode={BLEND_MODES.ADD_NPM}
        tint={color}
        anchor={[0.5, 0.5]}
      />
      <Sprite
        image={note}
        x={cursorx - WIDTH / 2 + props.x}
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
