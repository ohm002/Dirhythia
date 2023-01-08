import { Container, Sprite, useApp, useTick } from '@inlet/react-pixi'
import {
  BLEND_MODES,
  Texture,
  Container as CONTAINER,
  Sprite as SPRITE,
} from 'pixi.js'
import { useState } from 'react'
import note from '../../../assets/note.png'
import hit from '../../../assets/hit.png'
import { interpolate } from '../../../libs/interpolate'
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
  OFFSET,
  SCROLL_SPEED,
  WIDTH,
} from '../../../libs/options'
import LNOTE from '../../../assets/NOTE/LNOTE.png'
import RNOTE from '../../../assets/NOTE/RNOTE.png'
import NOTE from '../../../assets/NOTE/NOTE.png'
import { GameState } from '../../../state/GameState'
import { TimingPoint } from '../../../types/TimingPoint'
import { Beatmap } from '../../../types/Beatmap'

type HoldProps = {
  x: number
  startTime: number
  endTime: number
  i: number
  timingPoint: TimingPoint
  game: GameState
  keys: number
}
let container = new CONTAINER()
export default function Hold(props: HoldProps) {
  const app = useApp()
  let holdDuration = props.endTime - props.startTime
  const [height, setheight] = useState(
    Math.round((holdDuration * props.game.notespeed) / 1000)
  )
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
  let note = props.keys == 2 ? SPRITE.from(LNOTE) : props.keys == 3 ?  SPRITE.from(RNOTE) :  SPRITE.from(NOTE)  
  let hits = SPRITE.from(hit)
  let hold = new SPRITE(Texture.WHITE)
  // <Sprite
  //       texture={}
  //       x={}
  //       y={y + height}
  //       alpha={holdfade}
  //       anchor={[0.5, 1]}
  //       width={HOLD_WIDTH}
  //       height={height}
  //     />
  if (container.getChildByName('note' + props.i + props.keys) == null) {
    hold.name = 'hold' + props.i + props.keys
    if (props.keys == 2 || props.keys == 3) {
      note.anchor.set(props.keys == 2 ? 1 : 0, 1)
      hits.anchor.set(props.keys == 2 ? 1 : 0, 1)
      hold.anchor.set(props.keys == 2 ? 1 : 0, 0)
      note.width = COL_WIDTH * 2
      hits.width = COL_WIDTH * 2
      hold.width = COL_WIDTH * 2 - 10
      hold.tint = color
      hits.tint = color
    } else {
      note.anchor.set(0.5, 1)
      hits.anchor.set(0.5, 1)
      note.width = COL_WIDTH 
      hits.width = COL_WIDTH
      hold.width = COL_WIDTH
      hold.tint = 0xffffff
      hits.tint = 0xffffff
    }
    hits.y = HEIGHT - JUDGEMENT_LINE_OFFSET_Y
    hits.blendMode = BLEND_MODES.ADD_NPM
    hits.name = 'hits' + props.i + props.keys
    hits.height = NOTE_HEIGHT * 3
    hits.alpha = 0
    note.name = 'note' + props.i + props.keys
    note.height = NOTE_HEIGHT
    container.addChild(hold)
    container.addChild(note)
    container.addChild(hits)
  } else {
    note = container.getChildByName('note' + props.i + props.keys)
    hold = container.getChildByName('hold' + props.i + props.keys)
    hits = container.getChildByName('hits' + props.i + props.keys)
  }

  hold.y = y
  note.y = y + height
  hold.height = height
  hold.alpha = holdfade
  if (props.game.mode == 'play') hits.alpha = effalpha
  note.alpha = alpha
  if (props.keys == 2 || props.keys == 3) {
    note.x = cursorx
    hold.x = cursorx
    if (props.game.mode == 'play') hits.x = cursorx
  } else {
    if (props.game.mode == 'play') hits.x = cursorx - WIDTH / 2 + props.x
    note.x = cursorx - WIDTH / 2 + props.x
    hold.x = cursorx - WIDTH / 2 + props.x
  }
  useTick(() => {
    let isPlaying = props.game.isPlaying
    if (isPlaying) {
      setheight(Math.round((holdDuration * props.game.notespeed) / 1000))
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
              props.game.NOTE_TRAVEL_DURATION() +
              props.game.NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION(),
            props.startTime +
              props.game.NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION() +
              (height / props.game.notespeed) * 1000,
          ],
          [-height, HEIGHT]
        )
      )
      setAlpha(
        interpolate(
          currentTime,
          [
            props.startTime,
            props.startTime +
              props.game.NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION(),
          ],
          [1, 0]
        )
      )
      if (!(clicked == '' && clicktime == -1)) {
        setEffAlpha(
          interpolate(currentTime, [clicktime, clicktime + 500], [1, 0])
        )
      }
      if (clicked == 'true') {
        setAlpha(0)
        setHoldfade(1)
      } else if (clicked == 'false') {
        setHoldfade(0.2)
      }
    }
  })
  if (container.getChildByName('container' + props.i) == null) {
    app.stage.addChild(container)
  }
  return null
}
