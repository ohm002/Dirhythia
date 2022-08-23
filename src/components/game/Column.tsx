import { HitObject } from '../../types/HitObject'
import { COL_1_KEY, COL_2_KEY, COL_3_KEY, COL_4_KEY } from '../../libs/options'

type ColumnProps = {
  hitobjects: HitObject[]
  i: number
}

export default function Column(props: ColumnProps) {
  const colkey = i == 0 ?  COL_1_KEY : i == 1 ? COL_2_KEY : i == 2 ? COL_3_KEY : i == 3 ? COL_4_KEY :
  useEffect(() => {
    const handlekeydown = (e: KeyboardEvent) => {
      e.preventDefault()
      switch (e.key) {
        case colkey:
          console.log("col" + i);
          switch (hitobjects.type) {
            case 'note':
              // note logic
            case 'hold':
              // hold logic
          }
      }
    }
  })
  // todo handle col 1 keydown, check if it match the note start time
  // for hold note : check if the keydown match the note starttime (trigger the hold head) if its triggered then,
  //                 check every certain milisec(possibly bpm or configured value) if there the hold note is still click (release for a short time will not trigger a miss)
  //                 release timing is not fun to play
  document.addEventListener('keydown', handleRetry)
  return (
    <div>Column</div>
  )
}
