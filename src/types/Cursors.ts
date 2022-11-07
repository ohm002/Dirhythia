import { HitSound } from './HitSound'

export type Cursors = {
  x: number
  startTime: number
  hitsound?: [HitSound]
  type: "slam" | "normal"
}
