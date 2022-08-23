import { Beatmap } from '../types/Beatmap'

const beatmap: Beatmap = {
	audioPath: 'https://dreamybull.s-ul.eu/5phIFXAu',
	metadata: {
		title: 'Life is beautiful',
		titleUnicode: 'Life is beautiful',
		artist: 'ReoNa',
		artistUnicode: 'ReoNa',
		creator: 'Laquarius',
		difficult: 'Easy',
	},
	mode:[{
		type: '2k',
		startTime : 562,
	}],
	hitObjects: [
		{
			type: 'note',
			column: 1,
			startTime: 562,
		},
		{
			type: 'note',
			column: 2,
			startTime: 1023,
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
