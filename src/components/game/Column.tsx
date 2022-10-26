import { Container, Sprite, useTick } from '@inlet/react-pixi'
import { current } from '@reduxjs/toolkit'
import { Texture } from 'pixi.js'
import { useEffect, useMemo, useState } from 'react'
import { playHitSound } from '../../libs/hitsounds'
import { interpolate } from '../../libs/interpolate'
import {
  COLCOLOR,
  COL_1_KEY,
  COL_2_KEY,
  COL_3_KEY,
  COL_4_KEY,
  COL_WIDTH,
  HEIGHT,
  NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
  OFFSET,
  PLAYFIELD_WIDTH,
  WIDTH,
} from '../../libs/options'
import { GameState } from '../../state/GameState'
import { HitObject } from '../../types/HitObject'
import { TimingPoint } from '../../types/TimingPoint'
import CursorNote from './CursorNote'
import Hold from './Hold'
import Note from './Note'

type ColumnProps = {
  /**
   * Hit objects of this column.
   */
  hitObjects: HitObject[]
  /**
   * Index of the column (1-indexed).
   */
  i: number
  /**
   * Beatmap's all timing points.
   */
  timingPoints: TimingPoint[]
  game: GameState
}

const getColKey = (i: number) => {
  switch (i) {
    case 1:
      return COL_1_KEY

    case 2:
      return COL_2_KEY

    case 3:
      return COL_3_KEY

    case 4:
      return COL_4_KEY
  }
}
// OD 5 equivalent
const maxAcceptableOffset = 150 // ms
const hitWindow300 = 50 // ms
const hitWindow100 = 100 // ms
const hitWindow50 = maxAcceptableOffset // ms

export default function Column(props: ColumnProps) {
  if (props.hitObjects.length == 0) {
    return null
  }
  let playStartTime = props.game.playStartTime
  let isPlaying = props.game.isPlaying
  let effectVolume = props.game.effectvolume

  // doesnt reset on game retry
  const [nextObjIndex, setNextObjIndex] = useState(0)
  const nextObj = useMemo(() => props.hitObjects[nextObjIndex], [nextObjIndex])
  const [checkHold, setcheckHold] = useState(-1)
  const hitsound = new Audio()
  hitsound.src = '../'
  let holds = props.hitObjects.filter((t) => {
    return t.type == 'hold' && t.column == props.i
  })
  useTick(() => {
    isPlaying = props.game.isPlaying
    if (isPlaying) {
      effectVolume = props.game.effectvolume
      playStartTime = props.game.playStartTime
      const currentTime = props.game.currenttime
      if (props.game.key[props.i - 1][0] == '1' && nextObj != undefined) {
        // find the hit object that player tried to click
        const clickedHitObject =
          nextObj.startTime >= currentTime - maxAcceptableOffset &&
          nextObj.startTime <= currentTime + maxAcceptableOffset
            ? nextObj
            : undefined
        if (clickedHitObject) {
          const offset = Math.abs(clickedHitObject.startTime - currentTime)
          setNextObjIndex(nextObjIndex + 1)
          props.game.key[props.i - 1] = '01'
          if (offset <= hitWindow300) {
            props.game.hit(300, clickedHitObject.startTime, props.i)
          } else if (hitWindow300 < offset && offset <= hitWindow100) {
            props.game.hit(100, clickedHitObject.startTime, props.i)
          } else if (hitWindow100 < offset && offset <= hitWindow50) {
            props.game.hit(50, clickedHitObject.startTime, props.i)
          }
        }
      }
      // inconsistent hold amount
      let currenthold = holds.filter((t) => {
        return (
          t.endTime != undefined &&
          t.startTime <= currentTime &&
          t.endTime >= currentTime
        )
      })[0]
      if (currenthold != undefined) {
        if (checkHold < currenthold.startTime) {
          setcheckHold(currenthold.startTime)
        } else if (currentTime >= checkHold) {
          setcheckHold(checkHold + 60000 / 170)
          if (props.game.key[props.i - 1][1] == '0') {
            props.game.miss(currenthold.startTime, props.i + 5)
          }
        }
      }
      if (nextObj != undefined) {
        if (currentTime > nextObj.startTime + 150) {
          props.game.miss(nextObj.startTime, props.i)
          setNextObjIndex(nextObjIndex + 1)
        }
      }
    }
  })

  let x =
    (WIDTH - PLAYFIELD_WIDTH) / 2 +
    (COL_WIDTH) * (props.i - 1) +
    COL_WIDTH / 2
  // if (props.i < 3) x-=10;
  // if (props.i > 2) x+=10;
  return (
    <Container position={[0, 0]}>
      {props.hitObjects.map((hitObject, i) =>
        hitObject.type == 'note' ? (
          <Note
            x={x}
            startTime={hitObject.startTime}
            keys={props.i}
            key={i}
            game={props.game}
          />
        ) : (
          <Hold
            x={x}
            startTime={hitObject.startTime}
            endTime={hitObject.endTime as number}
            timingPoint={
              props.timingPoints
                .filter((t) => t.time <= hitObject.startTime)
                .sort((t1, t2) => t2.time - t1.time)[0]
            }
            keys={props.i}
            key={i}
            game={props.game}
          />
        )
      )}
    </Container>
  )
}
