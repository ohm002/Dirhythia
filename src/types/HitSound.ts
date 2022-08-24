import { SampleSet } from './SampleSet'

export type HitSound = {
  type?: 'whistle' | 'finish' | 'clap'
  sampleSet?: SampleSet
  addition?: SampleSet
}
