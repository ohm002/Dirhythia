import { HitSound } from './HitSound'

export type HitObject = {
	type: 'note' | 'hold'
	column: 1 | 2 | 3 | 4 // 4k
	startTime: number
	endTime?: number
	hitsound?: [HitSound] | [HitSound, HitSound] // /head/tail
}
