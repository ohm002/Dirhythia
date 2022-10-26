import { Container, Sprite, useTick } from '@inlet/react-pixi'
import { BLEND_MODES } from 'pixi.js'
import { useState } from 'react'
import hit from '../../assets/hit.png'
import note from '../../assets/note.png'
import { interpolate } from '../../libs/interpolate'
import {
  COLCOLOR,
  COL_WIDTH,
  HEIGHT,
  JUDGEMENT_LINE_OFFSET_Y,
  NOTE_HEIGHT,
  NOTE_TRAVEL_DURATION,
  NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
  PLAYFIELD_WIDTH,
  WIDTH,
} from '../../libs/options'
import { GameState } from '../../state/GameState'
type NoteProps = {
  x: number
  startTime: number
  game: GameState
  keys: number
}

export default function Note(props: NoteProps) {
  let [clicked, setclicked] = useState(false)
  const [y, setY] = useState(0)
  const [alpha, setAlpha] = useState(1)
  const [clicktime, setclicktime] = useState(-1)
  const [effalpha, setEffAlpha] = useState(0)
  let color = COLCOLOR[props.keys - 1]
  const [cursorx, setcursorx] = useState(
    WIDTH / 2 - PLAYFIELD_WIDTH / 2 + 0.5 * PLAYFIELD_WIDTH
  )
  useTick(() => {
    let isPlaying = props.game.isPlaying
    const currentTime = props.game.currenttime
    if (isPlaying) {
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
              PLAYFIELD_WIDTH / 2 +
              props.game.beatmap.cursor[depth].x * PLAYFIELD_WIDTH
          )
      }
      props.game.hitlist.forEach((element) => {
        if (
          element == props.startTime.toString() + props.keys.toString() &&
          clicktime == -1
        ) {
          setclicked(true)
          setclicktime(currentTime)
        }
      })

      setY(
        interpolate(
          currentTime,
          [
            props.startTime -
              NOTE_TRAVEL_DURATION +
              NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
            props.startTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
          ],
          [0, HEIGHT]
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
      if (clicked) {
        setEffAlpha(
          interpolate(currentTime, [clicktime, clicktime + 1000], [1, 0])
        )
        setAlpha(0)
      }
    }
  })
  return (
    <Container>
      <Sprite
        image={hit}
        x={cursorx - WIDTH / 2 + props.x}
        y={HEIGHT - JUDGEMENT_LINE_OFFSET_Y}
        width={COL_WIDTH * 1.2}
        height={NOTE_HEIGHT * 2}
        alpha={effalpha}
        blendMode={BLEND_MODES.ADD}
        tint={color}
        anchor={[0.5, 0.5]}
      />
      <Sprite
        image={note}
        x={cursorx - WIDTH / 2 + props.x}
        y={y}
        tint={color}
        anchor={[0.5, 1]}
        width={COL_WIDTH}
        height={NOTE_HEIGHT}
        alpha={alpha}
      />
    </Container>
  )
}
