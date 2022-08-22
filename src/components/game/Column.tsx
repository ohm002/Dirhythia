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
  return (
    <div>Column</div>
  )
}
