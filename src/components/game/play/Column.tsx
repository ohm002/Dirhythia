import { Container, useTick, Text, useApp } from '@inlet/react-pixi'
import { Container as CONTAINER } from 'pixi.js'
import { useMemo, useState } from 'react'
import { playHitSound, playhs } from '../../../libs/hitsounds'
import {
  COL_1_KEY,
  COL_2_KEY,
  COL_3_KEY,
  COL_4_KEY,
  COL_WIDTH,
  HEIGHT,
  PLAYFIELD_WIDTH,
  WIDTH,
} from '../../../libs/options'
import { GameState } from '../../../state/GameState'
import { HitObject } from '../../../types/HitObject'
import { TimingPoint } from '../../../types/TimingPoint'
import Hold from './Hold'
import Note from './Note'
import { Sample } from '../../../libs/audio/sample'
import { AudioEngine } from '../../../libs/audio/engine'

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
// OD 8 equivalent
const maxAcceptableOffset = 200 - 10 * 8 // ms
const hitWindow300 = 80 - 6 * 8 // ms
const hitWindow100 = 140 - 8 * 8 // ms
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
  let holds = props.hitObjects
    .filter((t) => {
      return t.type == 'hold' && t.column == props.i
    })
    .sort((a, b) => {
      return a.startTime - b.startTime
    })
  useTick(() => {
    isPlaying = props.game.isPlaying
    if (isPlaying) {
      // if (props.i == 1) console.log(props.game.key[props.i - 1])
      effectVolume = props.game.effectvolume
      playStartTime = props.game.playStartTime
      const currentTime = props.game.currenttime
      if (props.game.mode == 'play') {
        if (props.game.key[props.i - 1][0] == '1' && nextObj != undefined) {
          // find the hit object that player tried to click
          const clickedHitObject =
            nextObj.startTime >= currentTime - maxAcceptableOffset &&
            nextObj.startTime <= currentTime + maxAcceptableOffset
              ? nextObj
              : undefined
          if (clickedHitObject) {
            const offset = Math.abs(clickedHitObject.startTime - currentTime)
            // console.log(offset)
            setNextObjIndex(nextObjIndex + 1)
            const check = async () => {
              if (offset <= hitWindow300) {
                await props.game.hit(
                  'perfect',
                  clickedHitObject.startTime,
                  props.i
                )
              } else if (hitWindow300 < offset && offset <= hitWindow100) {
                await props.game.hit(
                  'great',
                  clickedHitObject.startTime,
                  props.i
                )
              } else if (hitWindow100 < offset && offset <= hitWindow50) {
                await props.game.hit('ok', clickedHitObject.startTime, props.i)
              }
            }
            check()
          }
        }
        // inconsistent hold amount
        let currenthold = holds.filter((t) => {
          return t.endTime != undefined && t.endTime >= currentTime
        })[0]
        if (currenthold != undefined) {
          if (checkHold < currenthold.startTime) {
            setcheckHold(currenthold.startTime + 100)
            // change to bpm                    ^
          } else if (currentTime >= checkHold && checkHold != -1) {
            setcheckHold(checkHold + 100)
            // change to bpm         ^
            if (props.game.key[props.i - 1][1] == '0') {
              const miss = async () => {
                props.game.miss(currenthold.startTime, props.i)
              }
              miss()
            }
          }
          // if (
          //   Math.abs(currentTime - currenthold.endTime) < 10 &&
          //   props.game.key[props.i - 1][1] == '1'
          // )
          //   props.game.hit('perfect', currenthold.startTime, props.i + 6)
        }
        if (nextObj != undefined) {
          if (currentTime > nextObj.startTime + 150) {
            const miss = async () => {
              props.game.miss(currentTime, props.i)
            }
            miss()
            setNextObjIndex(nextObjIndex + 1)
          }
        }
      }
    }
  })
  // }
  let x =
    (WIDTH - PLAYFIELD_WIDTH) / 2 + COL_WIDTH * (props.i - 1) + COL_WIDTH / 2
  // if (props.i < 3) x-=10;
  // if (props.i > 2) x+=10;
  return (
    <>
    <Container position={[0, 0]}>
      {props.hitObjects.map((hitObject, i) =>
        hitObject.type == 'note' ? (
          <Note
            x={x}
            startTime={hitObject.startTime}
            keys={props.i}
            key={i}
            i={i}
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
            i={i}
            game={props.game}
          />
        )
      )}
    </Container>
    </>
  )
}
