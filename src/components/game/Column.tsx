import { Container, Sprite, useTick } from '@inlet/react-pixi'
import { current } from '@reduxjs/toolkit'
import { Texture } from 'pixi.js'
import { useEffect, useMemo, useState } from 'react'
import { playHitSound } from '../../libs/hitsounds'
import { interpolate } from '../../libs/interpolate'
import {
  COL_1_KEY,
  COL_2_KEY,
  COL_3_KEY,
  COL_4_KEY,
  COL_WIDTH,
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
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key == getColKey(props.i) && nextObj != undefined) {
        const currentTime = Date.now() - playStartTime
        // find the hit object that player tried to click
        const clickedHitObject =
          nextObj.startTime >= currentTime - maxAcceptableOffset &&
          nextObj.startTime <= currentTime + maxAcceptableOffset
            ? nextObj
            : undefined
        if (clickedHitObject) {
          const offset = Math.abs(clickedHitObject.startTime - currentTime)
          setNextObjIndex(nextObjIndex + 1)

          if (offset <= hitWindow300) {
            props.game.hit(300, clickedHitObject.startTime, props.i)
          } else if (hitWindow300 < offset && offset <= hitWindow100) {
            props.game.hit(100, clickedHitObject.startTime, props.i)
          } else if (hitWindow100 < offset && offset <= hitWindow50) {
            props.game.hit(50, clickedHitObject.startTime, props.i)
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [nextObj])

  const [input, setInput] = useState(false)
  useEffect(() => {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key == getColKey(props.i)) {
        setInput(true)
      }
    })
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key == getColKey(props.i)) {
        setInput(false)
      }
    })
  }, [input])

  const [checkHold, setcheckHold] = useState(-1)

  useTick(() => {
    isPlaying = props.game.isPlaying
    effectVolume = props.game.effectvolume
    if (isPlaying) {
      playStartTime = props.game.playStartTime
      const currentTime = Date.now() - playStartTime
      let currenthold = props.hitObjects.filter((t) => {
        return (
          t.endTime != undefined &&
          t.type == 'hold' &&
          t.startTime <= currentTime &&
          t.endTime >= currentTime &&
          t.column == props.i
        )
      })[0]
      if (currenthold != undefined) {
        if (checkHold < currenthold.startTime) {
          setcheckHold(currenthold.startTime)
        } else if (currentTime >= checkHold) {
          setcheckHold(checkHold + 60000 / 170 / 2)
          if (input) {
            props.game.hit(300, currenthold.startTime, props.i + 5)
          } else {
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

  const x =
    (WIDTH - PLAYFIELD_WIDTH) / 2 +
    (COL_WIDTH + 3) * (props.i - 1) +
    COL_WIDTH / 2

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
