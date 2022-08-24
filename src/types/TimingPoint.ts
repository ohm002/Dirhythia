export type TimingPoint = {
  /**
   * Start time of the timing section,
   * in milliseconds from the beginning of the beatmap's audio.
   */
  time: number
  /**
   * Beats per minute.
   */
  bpm: number
  /**
   * Amount of beats in a measure.
   */
  meter: number
  /**
   * Default sample set for hit objects
   */
  defaultSampleSet: 'soft' | 'normal' | 'drum'
  /**
   * Volume percentage for hit objects.
   */
  volume: number
}
