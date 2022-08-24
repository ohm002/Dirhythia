import { Container, useTick } from '@inlet/react-pixi'
import { useEffect } from 'react'
import {
  COL_1_KEY,
  COL_2_KEY,
  COL_3_KEY,
  COL_4_KEY,
  COL_WIDTH,
  PLAYFIELD_WIDTH,
  WIDTH,
} from '../../libs/options'
import { hit, hitlist } from '../../libs/redux/features/gameStateSlice'
import { useAppDispatch, useAppSelector } from '../../libs/redux/hooks'
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
}

export default function Column(props: ColumnProps) {
  const dispatch = useAppDispatch()
  const playStartTime = useAppSelector((state) => state.gameState.playStartTime)
  const objlist = useAppSelector((state) => state.gameState.hitlist)

  useEffect(() => {
    const getColKey = () => {
      switch (props.i) {
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
    const checkmiss = (clickedList: Array<HitObject>) => {
      props.hitObjects.every((e) => {
        let clicked = false
        clickedList.every((e2) => {
          clicked = true
            ? e2.startTime == e.startTime && e2.column == e.column
            : false
        })
        if (clicked) console.log('miss on ', e)
      })
    }
    // }
    // find the hit object that player tried to click
    const findClickedNote = (currentTime: number): HitObject | undefined => {
      const maxAcceptableOffset = 100 // ms

      const clickedHitObject = props.hitObjects.find(
        (h) =>
          h.startTime + maxAcceptableOffset >= currentTime &&
          h.startTime - maxAcceptableOffset <= currentTime
      )
      return clickedHitObject
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key == getColKey()) {
        e.preventDefault()

        const currentTime = Date.now() - playStartTime
        const clickedNote = findClickedNote(currentTime)

        if (clickedNote) {
          // todo: play the hs
          const hitWindow300 = 20 // ms
          const hitWindow100 = 60 // ms
          const hitWindow50 = 100 // ms

          const offset = Math.abs(clickedNote.startTime - currentTime)

          if (clickedNote.type == 'note') {
            // dispatch(combo())
            // dispatch(hitlist(clickedNote))
            let hitval = hitWindow300 > offset ? 300 : hitWindow300 < offset && offset <= hitWindow100 ? 100 : 
            hitWindow100 < offset && offset <= hitWindow50 ? 50 
            : 0
            dispatch(hit(hitval))
          } else {
            // todo handle hold note
            // probably will need to add `isHolding` state
            // early release will not count
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
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
          <Note x={x} startTime={hitObject.startTime} key={i} />
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
            key={i}
          />
        )
      )}
    </Container>
  )
}
