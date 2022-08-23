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
    { type: 'note', column: 1, startTime: 1151 },
    { type: 'note', column: 2, startTime: 1336 },
    { type: 'hold', column: 3, startTime: 1522, endTime: 2262 },
    { type: 'note', column: 2, startTime: 1522 },
  ],
  timingPoints: [
    {
      time: 1522,
      bpm: 162,
      meter: 4,
      defaultSampleSet: 'soft',
      volume: 100,
    },
  ],
}

export default beatmap
