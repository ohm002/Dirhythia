import { Beatmap } from '../types/Beatmap'

const beatmap: Beatmap = {
  audioPath: 'https://dreamybull.s-ul.eu/5phIFXAu',
  metadata: {
    title: 'Life is beautiful',
    titleUnicode: 'Life is beautiful',
    artist: 'ReoNa',
    artistUnicode: 'ReoNa',
    creator: 'D',
    difficult: 'Easy',
  },
  hitObjects: [
    {
      type: 'note',
      column: 1,
      startTime: 562,
    },
    {
      type: 'note',
      column: 4,
      startTime: 1023,
    },
    {
      type: 'note',
      column: 1,
      startTime: 1485,
    },
    {
      type: 'note',
      column: 2,
      startTime: 1715,
    },
    {
      type: 'note',
      column: 1,
      startTime: 1946,
    },
    {
      type: 'note',
      column: 2,
      startTime: 2177,
    },
    {
      type: 'note',
      column: 4,
      startTime: 2408,
    },
    {
      type: 'note',
      column: 3,
      startTime: 2638,
    },
    {
      type: 'note',
      column: 2,
      startTime: 2869,
    },
    {
      type: 'note',
      column: 3,
      startTime: 3100,
    },
    {
      type: 'hold',
      column: 4,
      startTime: 3100,
      endTime: 3562,
    },
    {
      type: 'note',
      column: 3,
      startTime: 3562,
    },
  ],
  timingPoints: [
    {
      time: 562,
      bpm: 130,
      meter: 4,
      defaultSampleSet: 'soft',
      volume: 100,
    },
  ],
}

export default beatmap
