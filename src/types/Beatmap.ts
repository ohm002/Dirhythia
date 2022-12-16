import { Cursors } from './Cursors'
import { HitObject } from './HitObject'
import { Metadata } from './Metadata'
import { TimingPoint } from './TimingPoint'
import { NoteSpeedModifier } from './NoteSpeedModifier'

export type Beatmap = {
  /**
   * Path to audio file.
   */
  audioPath: string
  bgPath: string
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
  speedChanges: NoteSpeedModifier[]
  hitObjects: HitObject[]
  cursor : Cursors[]
}
