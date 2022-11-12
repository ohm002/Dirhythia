import { Container, Sprite, useApp, useTick, Text } from '@inlet/react-pixi'
import {
  BLEND_MODES,
  filters,
  Texture,
  utils,
  Sprite as SPRITE,
  Container as CONTAINER,
  TextStyle,
} from 'pixi.js'
import { useEffect, useMemo, useState } from 'react'
import { interpolate } from '../../libs/interpolate'
import vertical from '../../assets/vertical.png'
import judgement from '../../assets/judgement.png'
import judgement2 from '../../assets/judgement2.png'
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
} from '../../libs/options'
import { GameState } from '../../state/GameState'
import { Beatmap } from '../../types/Beatmap'
import { TimingPoint } from '../../types/TimingPoint'
import hit from '../../assets/hit.png'
import arrowright from '../../assets/arrowright.png'
import arrowleft from '../../assets/arrowleft.png'

type CursorNoteProps = {
  x: number
  game: GameState
  key: number
  type: string
  i: number
  beatmap: Beatmap
}
type BPMLineProps = {
  game: GameState
  time: number
}
const container = new CONTAINER()

export function BPMLine(props: BPMLineProps) {
  const cursorlist = props.game.beatmap.cursor.sort(
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
        setAlpha(0)
      }
    }
  })
  return (
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
  )
}

export default function CursorNote(props: CursorNoteProps) {
  const app = useApp()
  let isPlaying = props.game.isPlaying
  // console.log(props.game.audio.duration)
  let effectVolume = props.game.effectvolume
  props.beatmap.cursor.sort((a, b) => a.startTime - b.startTime)
  const notex = props.x
  let endTime =
    props.beatmap.cursor[props.i + 1] != undefined
      ? props.beatmap.cursor[props.i + 1].startTime
      : props.game.audio.duration * 1000
  let startTime = props.beatmap.cursor[props.i]
    ? props.beatmap.cursor[props.i].startTime
    : 0
  let startpos =
    props.beatmap.cursor[props.i] != undefined
      ? props.beatmap.cursor[props.i].x
      : 0.5
  let lastpos = 0.5
  for (let index = 1; index < props.i + 1; index++) {
    if (props.beatmap.cursor[props.i - index].type == 'normal') {
      lastpos = props.beatmap.cursor[props.i - index].x
      break
    }
  }
  const trackx = props.type == 'normal' ? props.x : lastpos
  let Duration = endTime - startTime
  const height = Math.round((Duration * SCROLL_SPEED) / 1000)
  const [y, setY] = useState(-height)
  let currentTime = 0
  const [alpha, setAlpha] = useState(1)
  const [clicktime, setclicktime] = useState(-1)
  const [effalpha, setEffAlpha] = useState(0)
  let [clicked, setclicked] = useState(false)
  const [score, setscore] = useState('')

  const arrowdelay = 20
  // const app = useApp()
  // const container = app.stage
  // const container = new CONTAINER()

  let hiteffect = new SPRITE(Texture.WHITE)
  hiteffect.name = props.i + 'cursorf'
  if (container.getChildByName(props.i + 'cursorf') == null) {
    container.addChild(hiteffect)
    hiteffect.alpha = 0
  } else {
    hiteffect = container.getChildByName(props.i + 'cursorf')
  }

  hiteffect.width = 300
  hiteffect.height = NOTE_HEIGHT * 3
  hiteffect.blendMode = BLEND_MODES.ADD
  hiteffect.anchor.set(lastpos > startpos ? 1 : 0, 0.5)
  hiteffect.tint = lastpos > startpos ? 0x57d8ff : 0xff5986
  useTick(() => {
    currentTime = props.game.currenttime
    let isPlaying = props.game.isPlaying
    if (isPlaying) {
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
      if (clicked && clicktime != -1) {
        setEffAlpha(
          interpolate(currentTime, [clicktime, clicktime + 500], [1, 0])
        )
        hiteffect.alpha = effalpha
        setAlpha(0)
      }
      setY(
        interpolate(
          currentTime,
          [
            startTime -
              NOTE_TRAVEL_DURATION +
              NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
            endTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
          ],
          [-height, HEIGHT]
        )
      )
    }
  })
  const trackalpha = 0.5
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
  for (
    let i = 0;
    i < Math.abs(Math.floor(((lastpos - startpos) * CURSOR_AREA) / arrowdelay));
    i += 4
  ) {
    if (
      container.getChildByName('arrow' + i.toString() + props.i.toString()) ==
      null
    ) {
      const arrow = SPRITE.from(lastpos > startpos ? arrowleft : arrowright)
      arrow.anchor.set(lastpos > startpos ? 1 : 0, 1)
      arrow.alpha = 0.7
      arrow.tint = lastpos > startpos ? 0x57d8ff : 0xff5986
      arrow.blendMode = BLEND_MODES.ADD
      arrow.width = arrowdelay
      arrow.height = arrowdelay
      arrow.name = 'arrow' + i.toString() + props.i.toString()
      container.addChild(arrow)
    } else {
      const arrow = container.getChildByName(
        'arrow' + i.toString() + props.i.toString()
      )
      arrow.x = interpolate(
        interpolate(
          i /
            Math.abs(
              Math.floor(((lastpos - startpos) * CURSOR_AREA) / arrowdelay)
            ),
          [0, 1],
          [lastpos, startpos]
        ),
        [0, 1],
        [WIDTH / 2 - CURSOR_AREA / 2, WIDTH / 2 + CURSOR_AREA / 2]
      )
      arrow.y = y + height - 30
    }
  }

  hiteffect.x = offsetx
  hiteffect.y = HEIGHT - JUDGEMENT_LINE_OFFSET_Y
  app.stage.addChild(container)
  return (
    <Container name="cursornotecontainer">
      <Sprite
        texture={Texture.WHITE}
        width={PLAYFIELD_WIDTH * 1.3}
        height={height}
        x={interpolate(
          trackx,
          [0, 1],
          [WIDTH / 2 - CURSOR_AREA / 2, WIDTH / 2 + CURSOR_AREA / 2]
        )}
        y={y + height}
        tint={0x000000}
        // filters={[new filters.BlurFilter(2)]}
        anchor={[0.5, 1]}
        alpha={1}
      />
      <Sprite
        // texture={Texture.WHITE}
        image={judgement2}
        x={interpolate(
          props.x,
          [0, 1],
          [WIDTH / 2 - CURSOR_AREA / 2, WIDTH / 2 + CURSOR_AREA / 2]
        )}
        y={y + height}
        tint={lastpos > startpos ? 0x57d8ff : 0xff5986}
        anchor={lastpos > startpos ? [0, 1] : [1, 1]}
        alpha={1}
        width={Math.abs(lastpos - startpos) * CURSOR_AREA}
        blendMode={BLEND_MODES.ADD_NPM}
        height={200}
      />
      <Sprite
        texture={Texture.WHITE}
        tint={COLCOLOR[0]}
        x={interpolate(
          trackx,
          [0, 1],
          [
            WIDTH / 2 - CURSOR_AREA / 2 - COL_WIDTH,
            WIDTH / 2 + CURSOR_AREA / 2 - COL_WIDTH,
          ]
        )}
        alpha={0.1}
        y={y + height}
        anchor={[1, 1]}
        height={height}
        width={COL_WIDTH}
      />
      <Sprite
        texture={Texture.WHITE}
        tint={COLCOLOR[1]}
        x={interpolate(
          trackx,
          [0, 1],
          [WIDTH / 2 - CURSOR_AREA / 2, WIDTH / 2 + CURSOR_AREA / 2]
        )}
        alpha={trackalpha}
        y={y + height}
        anchor={[1, 1]}
        height={height}
        width={COL_WIDTH}
      />
      <Sprite
        texture={Texture.WHITE}
        tint={COLCOLOR[2]}
        x={interpolate(
          trackx,
          [0, 1],
          [WIDTH / 2 - CURSOR_AREA / 2, WIDTH / 2 + CURSOR_AREA / 2]
        )}
        alpha={trackalpha}
        y={y + height}
        anchor={[0, 1]}
        height={height}
        width={COL_WIDTH}
      />
      <Sprite
        texture={Texture.WHITE}
        tint={COLCOLOR[3]}
        x={interpolate(
          trackx,
          [0, 1],
          [
            WIDTH / 2 - CURSOR_AREA / 2 + COL_WIDTH,
            WIDTH / 2 + CURSOR_AREA / 2 + COL_WIDTH,
          ]
        )}
        y={y + height}
        alpha={0.1}
        anchor={[0, 1]}
        height={height}
        width={COL_WIDTH}
      />
      <Sprite
        image={vertical}
        x={interpolate(
          trackx,
          [0, 1],
          [WIDTH / 2 - CURSOR_AREA / 2, WIDTH / 2 + CURSOR_AREA / 2]
        )}
        y={y + height}
        anchor={[0.5, 1]}
        alpha={1}
        blendMode={BLEND_MODES.ADD}
        width={100}
        height={height}
      />
      <Sprite
        image={vertical}
        x={interpolate(
          trackx,
          [0, 1],
          [
            WIDTH / 2 - CURSOR_AREA / 2 + PLAYFIELD_WIDTH / 2,
            WIDTH / 2 + CURSOR_AREA / 2 + PLAYFIELD_WIDTH / 2,
          ]
        )}
        y={y + height}
        anchor={[0.5, 1]}
        alpha={0.2}
        blendMode={BLEND_MODES.ADD}
        width={100}
        height={height}
      />
      <Sprite
        image={vertical}
        x={interpolate(
          trackx,
          [0, 1],
          [
            WIDTH / 2 - CURSOR_AREA / 2 - PLAYFIELD_WIDTH / 2,
            WIDTH / 2 + CURSOR_AREA / 2 - PLAYFIELD_WIDTH / 2,
          ]
        )}
        y={y + height}
        anchor={[0.5, 1]}
        alpha={0.2}
        blendMode={BLEND_MODES.ADD}
        width={100}
        height={height}
      />
    </Container>
  )
}
