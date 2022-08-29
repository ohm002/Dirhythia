import { Cursors } from './Cursors'
import { HitObject } from './HitObject'
import { Metadata } from './Metadata'
import { TimingPoint } from './TimingPoint'

export type Beatmap = {
  /**
   * Path to audio file.
   */
  audioPath: string
  /**
   * Metadata.
   */
  metadata: Metadata
  /**
   * Timing points.
   */
  timingPoints: TimingPoint[]
  /**
   * Hit objects (note/ hold/ cursor).
   */
  hitObjects: HitObject[]
  cursor : Cursors[]
}
