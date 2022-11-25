import { Container, Sprite, useTick, Text, useApp } from '@inlet/react-pixi'
import {
  BLEND_MODES,
  Text as PIXITEXT,
  TextStyle,
  Sprite as SPRITE,
  Texture,
  Application,
  Filter,
  Container as CONTAINER,
  filters,
} from 'pixi.js'
import PIXI from 'pixi.js'
import { useState } from 'react'
import hit from '../../../assets/hit.png'
import note from '../../../assets/note.png'
import perfect from '../../../assets/perfect.png'
import great from '../../../assets/great.png'
import ok from '../../../assets/ok.png'
import miss from '../../../assets/miss.png'
import { interpolate } from '../../../libs/interpolate'
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
} from '../../../libs/options'
import { GameState } from '../../../state/GameState'
import PlayField from './PlayField'
import { triggereffect } from './Display'
import { Beatmap } from '../../../types/Beatmap'

type NoteProps = {
  x: number
  startTime: number
  game: GameState
  keys: number
  i: number
}
let container = new CONTAINER()

export default function Note(props: NoteProps) {
  const app = useApp()
  container.name = 'container' + props.i
  let [clicked, setclicked] = useState(false)
  const [y, setY] = useState(0)
  const [alpha, setAlpha] = useState(1)
  const [clicktime, setclicktime] = useState(-1)
  const [effalpha, setEffAlpha] = useState(0)
  let color = COLCOLOR[props.keys - 1]
  const [cursorx, setcursorx] = useState(
    WIDTH / 2 - CURSOR_AREA / 2 + 0.5 * CURSOR_AREA
  )
  const cursorlist = (props.game.beatmap as Beatmap).cursor.sort(
    (a, b) => a.startTime - b.startTime
  )
  const mode = (props.game.beatmap as Beatmap).timingPoints.filter(
    (a) => a.time <= props.startTime
  )[0].mode
  let note = SPRITE.from(Texture.WHITE)
  let hits = SPRITE.from(hit)
  if (container.getChildByName('note' + props.i + props.keys) == null) {
    if ((mode == '2k' && props.keys == 2) || props.keys == 3) {
      note.anchor.set(props.keys == 2 ? 1 : 0, 1)
      hits.anchor.set(props.keys == 2 ? 1 : 0, 1)
      note.width = COL_WIDTH * 2
      hits.width = COL_WIDTH * 2
      note.tint = color
      hits.tint = color
    } else {
      note.anchor.set(0.5, 1)
      hits.anchor.set(0.5, 1)
      note.width = COL_WIDTH
      hits.width = COL_WIDTH
      note.tint = 0xffffff
      hits.tint = 0xffffff
    }
    hits.y = HEIGHT - JUDGEMENT_LINE_OFFSET_Y
    hits.blendMode = BLEND_MODES.ADD_NPM
    hits.alpha = 0
    hits.name = 'hits' + props.i + props.keys
    hits.height = NOTE_HEIGHT * 3
    note.name = 'note' + props.i + props.keys
    note.height = NOTE_HEIGHT
    container.addChild(note)
    container.addChild(hits)
  } else {
    note = container.getChildByName('note' + props.i + props.keys)
    if (props.game.mode == 'play')
      hits = container.getChildByName('hits' + props.i + props.keys)
  }

  hits.alpha = effalpha
  note.alpha = alpha
  note.y = y
  if ((mode == '2k' && props.keys == 2) || props.keys == 3) {
    note.x = cursorx
    hits.x = cursorx
  } else {
    hits.x = cursorx - WIDTH / 2 + props.x
    note.x = cursorx - WIDTH / 2 + props.x
  }
  useTick(() => {
    let isPlaying = props.game.isPlaying
    const currentTime = props.game.currenttime
    if (isPlaying) {
      if (
        currentTime >
        props.startTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION
      ) {
        // setactive(false)
      }
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
            setclicktime(currentTime)
          }
        })
      if (!clicked || clicktime == -1) {
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
      } else {
        setEffAlpha(
          interpolate(currentTime, [clicktime, clicktime + 200], [1, 0])
        )
        setAlpha(0)
      }
    }
  })
  if (container.getChildByName('container' + props.i) == null) {
    app.stage.addChild(container)
  }
  return null
}
