import { Beatmap } from '../types/Beatmap'

export function parseBeatmap(data: string): Beatmap {
	return JSON.parse(data) as Beatmap
}
