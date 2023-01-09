import { Container, Sprite, useApp, useTick, Text } from '@inlet/react-pixi'
import {
  BLEND_MODES,
  Texture,
  Sprite as SPRITE,
  Container as CONTAINER,
  TextureLoader,
  generateUniformBufferSync,
  Renderer,
  RenderTexture,
  autoDetectRenderer,
  Graphics,
} from 'pixi.js'
import { useEffect, useMemo, useState } from 'react'
import { easeOutCubic, interpolate } from '../../../libs/interpolate'
import vertical from '../../../assets/vertical.png'
import judgement from '../../../assets/judgement.png'
import judgement2 from '../../../assets/judgement2.png'
import {
  COLCOLOR,
  COL_WIDTH,
  CURSOR_AREA,
  CURSOR_LEFT_KEY,
  CURSOR_RIGHT_KEY,
  HEIGHT,
  HOLD_WIDTH,
  JUDGEMENT_LINE_OFFSET_Y,
  NOTE_HEIGHT,
  NOTE_TRAVEL_DURATION,
  NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
  OFFSET,
  PLAYFIELD_WIDTH,
  SCROLL_SPEED,
  WIDTH,
} from '../../../libs/options'
import { GameState } from '../../../state/GameState'
import { Beatmap } from '../../../types/Beatmap'
import { TimingPoint } from '../../../types/TimingPoint'
import hitright from '../../../assets/cursorhitright.png'
import hitleft from '../../../assets/cursorhitleft.png'
import arrowright from '../../../assets/arrowright.png'
import arrowleft from '../../../assets/arrowleft.png'
import { NoteSpeedModifier } from '../../../types/NoteSpeedModifier'
import { BaseRenderTexture, GenerateTextureSystem } from '@pixi/core'

type CursorNoteProps = {
  x: number
  game: GameState
  key: number
  type: string
  container: CONTAINER
  i: number
  beatmap: Beatmap
}
type BPMLineProps = {
  game: GameState
  time: number
}
let container = new CONTAINER()
export function BPMLine(props: BPMLineProps) {
  const cursorlist = (props.game.beatmap as Beatmap).cursor.sort(
    (a, b) => a.startTime - b.startTime
  )
  const [y, sety] = useState(0)
  const [cursorx, setcursorx] = useState(0.5)
  const [alpha, setAlpha] = useState(0.5)
  useTick(() => {
    const currentTime = props.game.currenttime
    const isPlaying = props.game.isPlaying
    if (cursorlist.length > 0) {
      let depth = -1
      for (let w = 0; w < cursorlist.length; w++) {
        const element = cursorlist[w]
        if (props.time < element.startTime) {
          break
        }
        depth++
      }
      if (depth > -1) setcursorx(cursorlist[depth].x)
    }
    if (isPlaying) {
      if (
        currentTime <=
        props.time + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION
      ) {
        sety(
          interpolate(
            currentTime,
            [
              props.time -
                NOTE_TRAVEL_DURATION +
                NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
              props.time + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
            ],
            [0, HEIGHT]
          )
        )
      } else {
        setAlpha(
          interpolate(
            currentTime,
            [props.time, props.time + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION],
            [1, 0]
          )
        )
      }
    }
  })
  return (
    <>
      <Sprite
        texture={Texture.WHITE}
        width={PLAYFIELD_WIDTH}
        height={2}
        anchor={[0.5, 1]}
        alpha={alpha}
        x={interpolate(
          cursorx,
          [0, 1],
          [WIDTH / 2 - CURSOR_AREA / 2, WIDTH / 2 + CURSOR_AREA / 2]
        )}
        y={y}
      />
    </>
  )
}

// const renderer = (new CanvasRenderer())
export default function CursorNote(props: CursorNoteProps) {
  const app = useApp()
  // app.stage.addChild(container)
  container = props.container
  let effectVolume = props.game.effectvolume
  props.beatmap.cursor = props.beatmap.cursor.sort(
    (a, b) => a.startTime - b.startTime
  )
  const notex = props.x
  let endTime = props.beatmap.cursor[props.i + 1]
    ? props.beatmap.cursor[props.i + 1].startTime
    : !Number.isNaN(props.game.audio.duration)
    ? props.game.audio.duration * 1000
    : 1000000
  let startTime = props.beatmap.cursor[props.i]
    ? props.beatmap.cursor[props.i].startTime
    : 0
  let startpos =
    props.beatmap.cursor[props.i] != undefined
      ? props.beatmap.cursor[props.i].x
      : 0.5
  let lastpos = 0.5
  const trackx = props.type == 'normal' ? props.x : lastpos
  let Duration = endTime - startTime
  let currentspeed = SCROLL_SPEED
  const [height, setheight] = useState(
    Math.round((Duration * currentspeed) / 1000)
  )
  const [y, setY] = useState(-height)
  let currentTime = 0

  for (let index = 1; index < props.i + 1; index++) {
    if (
      props.beatmap.cursor[props.i - index].type == 'normal' ||
      props.beatmap.cursor[props.i - index] != undefined
    ) {
      lastpos = props.beatmap.cursor[props.i - index].x
      break
    }
  }
  const color = lastpos > startpos ? 0x3dd2ff : 0xff6161
  const [active, setactive] = useState(true)
  const [clicktime, setclicktime] = useState(-1)
  const [effalpha, setEffAlpha] = useState(0)
  const [alpha, setAlpha] = useState(0)
  let [clicked, setclicked] = useState(false)
  const [score, setscore] = useState('')

  const arrowdelay = 20
  const a =
    lastpos > startpos
      ? -(PLAYFIELD_WIDTH / 2 + (PLAYFIELD_WIDTH * 0.3) / 2)
      : PLAYFIELD_WIDTH / 2 + (PLAYFIELD_WIDTH * 0.3) / 2
  let offsetx = interpolate(
    props.x,
    [0, 1],
    [WIDTH / 2 - CURSOR_AREA / 2, WIDTH / 2 + CURSOR_AREA / 2]
  )
  offsetx += props.type == 'normal' ? a : 0
  let hiteffect = SPRITE.from(lastpos > startpos ? hitleft : hitright)
  let switchlineg = new Graphics()
  let rowb = new Graphics()
  rowb.lineStyle(2, 0xffffff, 1)
  rowb.beginFill(0x000000)
  rowb.drawRect(0, 0, PLAYFIELD_WIDTH * 1.3, height)
  rowb.endFill()
  let rowbg = rowb
  switchlineg.lineStyle(4, 0xffffff, 1)
  switchlineg.beginFill(color)
  switchlineg.drawRect(0, 0, Math.abs(lastpos - startpos) * CURSOR_AREA, 26)
  switchlineg.endFill()
  // let switchlinegg = useApp().renderer.generateTexture(switchlineg)
  // console.log(switchlinegg)
  let switchline = switchlineg
  let line1 = new SPRITE(Texture.WHITE)
  let point = new SPRITE(Texture.WHITE)
  let point2 = new SPRITE(Texture.WHITE)
  let line2 = SPRITE.from(vertical)
  let line3 = SPRITE.from(vertical)
  if (container.getChildByName('switchline' + props.i) == null) {
    line1.x = interpolate(
      trackx,
      [0, 1],
      [WIDTH / 2 - CURSOR_AREA / 2, WIDTH / 2 + CURSOR_AREA / 2]
    )
    point.width = 10
    point.anchor.set(0.5)
    point.height = 10
    point.rotation = (45 * 3.14) / 180
    point.name = 'point' + props.i
    point2.width = 10
    point2.anchor.set(0.5)
    point2.height = 10
    point2.rotation = (45 * 3.14) / 180
    point2.name = 'point2' + props.i
    point.alpha = point2.alpha = 0
    line1.anchor.set(0.5, 1)
    line1.width = 3
    line1.alpha = 1
    line1.height = height
    line1.name = 'line1' + props.i
    line2.anchor.set(0.5, 1)
    line2.width = 100
    line2.name = 'line2' + props.i
    line2.alpha = 0
    line3.anchor.set(0.5, 1)
    line3.width = 100
    line3.name = 'line3' + props.i
    line3.alpha = 0
    line2.x = interpolate(
      trackx,
      [0, 1],
      [
        WIDTH / 2 - CURSOR_AREA / 2 + PLAYFIELD_WIDTH / 2,
        WIDTH / 2 + CURSOR_AREA / 2 + PLAYFIELD_WIDTH / 2,
      ]
    )
    line3.x = interpolate(
      trackx,
      [0, 1],
      [
        WIDTH / 2 - CURSOR_AREA / 2 - PLAYFIELD_WIDTH / 2,
        WIDTH / 2 + CURSOR_AREA / 2 - PLAYFIELD_WIDTH / 2,
      ]
    )
    hiteffect.alpha = 0
    hiteffect.x = offsetx
    hiteffect.name = props.i + 'cursorf'
    rowbg.name = props.i + 'rowbg'
    rowbg.x = interpolate(
      trackx,
      [0, 1],
      [
        WIDTH / 2 - CURSOR_AREA / 2 - rowbg.width / 2,
        WIDTH / 2 + CURSOR_AREA / 2 - rowbg.width / 2,
      ]
    )
    rowbg.alpha = 1
    switchline.name = 'switchline' + props.i
    const anchor = lastpos > startpos ? 0 : -switchline.width
    switchline.x = interpolate(
      props.x,
      [0, 1],
      [
        WIDTH / 2 - CURSOR_AREA / 2 + anchor,
        WIDTH / 2 + CURSOR_AREA / 2 + anchor,
      ]
    )
    container.addChild(hiteffect)
    container.addChild(rowbg)
    container.addChild(line1)
    container.addChild(line2)
    container.addChild(switchline)
    container.addChild(line3)
    container.addChild(point)
    container.addChild(point2)
  } else {
    switchline = container.getChildByName('switchline' + props.i)
    rowbg = container.getChildByName(props.i + 'rowbg')
    point = container.getChildByName('point' + props.i)
    point2 = container.getChildByName('point2' + props.i)
    line1 = container.getChildByName('line1' + props.i)
    line2 = container.getChildByName('line2' + props.i)
    line3 = container.getChildByName('line3' + props.i)
    hiteffect = container.getChildByName(props.i + 'cursorf')
  }

  hiteffect.y = HEIGHT - JUDGEMENT_LINE_OFFSET_Y
  hiteffect.width = 300
  hiteffect.height = 50
  hiteffect.blendMode = BLEND_MODES.ADD_NPM
  hiteffect.anchor.set(lastpos > startpos ? 1 : 0, 0.5)
  hiteffect.tint = color

  point2.x = interpolate(
    trackx,
    [0, 1],
    [WIDTH / 2 - CURSOR_AREA / 2, WIDTH / 2 + CURSOR_AREA / 2]
  )
  point.x = interpolate(
    trackx,
    [0, 1],
    [WIDTH / 2 - CURSOR_AREA / 2, WIDTH / 2 + CURSOR_AREA / 2]
  )
  line2.height = height
  line1.height = height
  line3.height = height
  switchline.y = y + height - switchline.height
  rowbg.y = y + height - rowbg.height
  line1.y = y + height
  line2.y = y + height
  line3.y = y + height
  point.y = y + height
  point2.y = y
  useTick(() => {
    currentTime = props.game.currenttime
    let isPlaying = props.game.isPlaying
    if (clicked && clicktime != -1 && currentTime) {
      hiteffect.alpha = interpolate(
        currentTime,
        [clicktime, clicktime + 300],
        [1, 0]
      )
      hiteffect.x = easeOutCubic(
        currentTime,
        [clicktime, clicktime + 300],
        [offsetx, lastpos > startpos ? offsetx - 50 : offsetx + 50]
      )
    }
    // if (
    //   currentTime >=
    //     startTime -
    //       props.game.NOTE_TRAVEL_DURATION() +
    //       props.game.NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION() &&
    //   currentTime <=
    //     endTime + props.game.NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION() &&
    //   props.game.mode == 'play'
    // ) {
    //   setactive(true)
    // } else {
    //   setactive(false)
    // }

    if (
      (isPlaying &&
        active &&
        currentTime >=
          startTime -
            props.game.NOTE_TRAVEL_DURATION() +
            +props.game.NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION()) ||
      props.game.mode == 'editor'
    ) {
      // point.alpha = active ? alpha : 0
      // point2.alpha = active ? alpha : 0
      // console.log(point.alpha)
      if (props.game.hitlist.length > 0)
        props.game.hitlist.forEach((element: any) => {
          if (
            element.startsWith(startTime.toString() + '5') &&
            !element.endsWith('miss') &&
            clicktime == -1
          ) {
            setclicked(true)
            setscore(element.split(',')[1])
            setclicktime(currentTime)
          }
        })

      if (
        (currentTime >
          endTime + props.game.NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION() ||
          currentTime <
            startTime -
              props.game.NOTE_TRAVEL_DURATION() +
              props.game.NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION()) &&
        props.game.mode == 'play'
      ) {
        setactive(false)
      }

      setY(
        interpolate(
          currentTime,
          [
            startTime -
              props.game.NOTE_TRAVEL_DURATION() +
              props.game.NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION(),
            endTime + props.game.NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION(),
          ],
          [-height, HEIGHT]
        )
      )
      setAlpha(
        interpolate(
          currentTime,
          [
            endTime,
            endTime + props.game.NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION(),
          ],
          [1, 0]
        )
      )
      switchline.alpha = 0.7
      rowbg.alpha = alpha
    }
  })

  return null
}
