import { HitSound } from './HitSound'

export type Cursors = {
  x: number
  startTime: number
  hitsound?: [HitSound] | [HitSound, HitSound] // /head/tail
}
