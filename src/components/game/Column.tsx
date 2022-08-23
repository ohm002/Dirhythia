import { HitObject } from '../../types/HitObject'

type ColumnProps = {
  hitobjects: HitObject[]
  /**
   * Index of the column (1-indexed).
   */
  i: number
}

export default function Column(props: ColumnProps) {
  // todo handle col 1 keydown, check if it match the note start time
  // for hold note : check if the keydown match the note starttime,
  //                 check every certain milisec(possibly bpm or configured value) if there the hold note is still click (release for a short time will not trigger a miss)
  //                 release timing is not fun to play
  return (
    <div>Column</div>
  )
}
