import { Container, useTick } from '@inlet/react-pixi'
import { useEffect } from 'react'
import { COL_WIDTH, PLAYFIELD_WIDTH, WIDTH } from '../../libs/options'
import { useAppSelector } from '../../libs/redux/hooks'
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

  timingPoints: TimingPoint[]
}

export default function Column(props: ColumnProps) {
  // todo handle col 1 keydown, check if it match the note start time
  // for hold note:
  //  check if the keydown match the note starttime,
  //  check every certain milisec(possibly bpm or configured value) if there the hold note is still click (release for a short time will not trigger a miss)
  //  release timing is not fun to play

  const x =
    (WIDTH - PLAYFIELD_WIDTH) / 2 + COL_WIDTH * (props.i - 1) + COL_WIDTH / 2

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
