import { Container, Sprite, useTick, Text, useApp } from '@inlet/react-pixi'
import {
  BLEND_MODES,
  Text as PIXITEXT,
  TextStyle,
  Sprite as SPRITE,
  Texture,
  Application,
  Filter,
  filters,
} from 'pixi.js'
import PIXI from 'pixi.js'
import { useState } from 'react'
import hit from '../../assets/hit.png'
import note from '../../assets/note.png'
import perfect from '../../assets/perfect.png'
import great from '../../assets/great.png'
import ok from '../../assets/ok.png'
import miss from '../../assets/miss.png'
import { interpolate } from '../../libs/interpolate'
import {
  COLCOLOR,
  COL_WIDTH,
  CURSOR_AREA,
  HEIGHT,
  JUDGEMENT_LINE_OFFSET_Y,
  NOTE_HEIGHT,
  NOTE_TRAVEL_DURATION,
  NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
  PLAYFIELD_WIDTH,
  WIDTH,
} from '../../libs/options'
import { GameState } from '../../state/GameState'
import PlayField from './PlayField'
import { triggereffect } from './Display'

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
  const [score, setscore] = useState('')
  let color = COLCOLOR[props.keys - 1]
  const [cursorx, setcursorx] = useState(
    WIDTH / 2 - CURSOR_AREA / 2 + 0.5 * CURSOR_AREA
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
              CURSOR_AREA / 2 +
              props.game.beatmap.cursor[depth].x * CURSOR_AREA
          )
      }
      if (props.game.hitlist.length > 0)
        props.game.hitlist.forEach((element: any) => {
          if (
            element.startsWith(
              props.startTime.toString() + props.keys.toString()
            ) &&
            !element.endsWith('miss') &&
            clicktime == -1
          ) {
            setclicked(true)
            setscore(element.split(',')[1])
            setclicktime(currentTime)
          }
        })

      if (!clicked) {
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
      }
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
          interpolate(currentTime, [clicktime, clicktime + 500], [1, 0])
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
        width={COL_WIDTH *5}
        height={NOTE_HEIGHT * 3}
        alpha={effalpha}
        blendMode={BLEND_MODES.ADD_NPM}
        tint={color}
        anchor={[0.5, 0.5]}
      />
      <Sprite
        image={note}
        x={cursorx - WIDTH / 2 + props.x}
        y={y}
        tint={0xffffff}
        anchor={[0.5, 1]}
        width={COL_WIDTH}
        height={NOTE_HEIGHT}
        alpha={alpha}
      />
    </Container>
  )
}
