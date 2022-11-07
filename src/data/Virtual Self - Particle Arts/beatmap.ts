import { Beatmap } from '../../types/Beatmap'

const beatmap: Beatmap = {
  audioPath:
    'https://cdn.discordapp.com/attachments/671324264531492878/1011673846052552805/audio.mp3',
  metadata: {
    title: 'Particle Arts (Game Ver.)',
    titleUnicode: 'Particle Arts (Game Ver.)',
    artist: 'Virtual Self',
    artistUnicode: 'Virtual Self',
    creator: 'The Virtual Machine',
    difficult: 'Easy',
  },
  hitObjects: [
    { type: 'hold', column: 3, startTime: 500, endTime: 2000 },
    // { type: 'note', column: 3, startTime: 1522 },
    // { type: 'note', column: 3, startTime: 1522 },
    // { type: 'note', column: 1, startTime: 2633 },
    // { type: 'note', column: 2, startTime: 2818 },
    // { type: 'note', column: 2, startTime: 3003 },
    // { type: 'note', column: 1, startTime: 3003 },
  ],
  cursor: [{ x: 0.4, startTime: 1000, type: 'slam' }],
  timingPoints: [
    {
      time: 1151,
      bpm: 162,
      meter: 4,
      defaultSampleSet: 'drum',
      volume: 100,
    },
  ],
}

export default beatmap
