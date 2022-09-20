import { Container, Sprite, useTick } from '@inlet/react-pixi'
import { useEffect, useMemo, useState } from 'react'
import { playHitSound } from '../../libs/hitsounds'
import {
  COL_1_KEY,
  COL_2_KEY,
  COL_3_KEY,
  COL_4_KEY,
  COL_WIDTH,
  OFFSET,
  PLAYFIELD_WIDTH,
  WIDTH,
} from '../../libs/options'
import { GameState } from '../../state/GameState'
import { HitObject } from '../../types/HitObject'
import { TimingPoint } from '../../types/TimingPoint'
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
  const [lastClickedIndex, setLastClickedIndex] = useState(-1)
  const nextObj = useMemo(() => props.hitObjects[nextObjIndex], [nextObjIndex])
  const timingPointOfNextObj = useMemo(
    () =>
      props.timingPoints
        .filter((t) => t.time <= nextObj.startTime)
        .sort((t1, t2) => t2.time - t1.time)[0],
    [nextObj]
  )

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key == getColKey(props.i)) {
        e.preventDefault()

        const currentTime = Date.now() - playStartTime
        // find the hit object that player tried to click
        const clickedHitObject =
          nextObj.startTime >= currentTime - maxAcceptableOffset &&
          nextObj.startTime <= currentTime + maxAcceptableOffset
            ? nextObj
            : undefined

        if (clickedHitObject) {
          setLastClickedIndex(lastClickedIndex + 1)
          // play the hs
          playHitSound(effectVolume, timingPointOfNextObj.defaultSampleSet)

          const offset = Math.abs(clickedHitObject.startTime - currentTime)
          if (clickedHitObject.type == 'note') {
            if (offset <= hitWindow300) {
              // console.log(offset)
              props.game.hit(300, clickedHitObject.startTime, props.i)
            } else if (hitWindow300 < offset && offset <= hitWindow100) {
              // console.log(offset)
              props.game.hit(100, clickedHitObject.startTime, props.i)
            } else if (hitWindow100 < offset && offset <= hitWindow50) {
              // console.log(offset)
              props.game.hit(50, clickedHitObject.startTime, props.i)
            }
          } else {
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [nextObj])

  useTick(() => {
    playStartTime = props.game.playStartTime
    isPlaying = props.game.isPlaying
    effectVolume = props.game.effectvolume
    if (isPlaying) {
      const currentTime = Date.now() - playStartTime

      if (
        currentTime > nextObj.startTime + maxAcceptableOffset &&
        nextObjIndex < props.hitObjects.length - 1
      ) {
        setNextObjIndex(nextObjIndex + 1)
      }
    } else {
      if (nextObjIndex != 0) setNextObjIndex(0)
      if (lastClickedIndex != -1) setLastClickedIndex(-1)
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
