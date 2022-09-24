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
    // { type: 'note', column: 1, startTime: 1151 },
    // { type: 'note', column: 2, startTime: 1336 },
    // { type: 'note', column: 2, startTime: 1522 },
    // { type: 'note', column: 3, startTime: 1522 },
    // { type: 'note', column: 1, startTime: 2633 },
    // { type: 'note', column: 2, startTime: 2818 },
    // { type: 'note', column: 2, startTime: 3003 },
    // { type: 'note', column: 1, startTime: 3003 },
  ],
  cursor: [
    { x: 0.25, startTime: 1151 },
    { x: 0.35, startTime: 1336 },
    { x: 0.25, startTime: 1522 },
    { x: 0.25, startTime: 4000},
  ],
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
