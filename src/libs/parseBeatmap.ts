import { Beatmap } from '../types/Beatmap'
import { OFFSET } from './options'

export function parseBeatmap(data: string): Beatmap {
  const beatmap = JSON.parse(data) as Beatmap

  const { audioPath, metadata, hitObjects, timingPoints, cursor } = beatmap

  const validAudioPath = typeof audioPath == 'string'

  const validMetadata =
    typeof metadata.title == 'string' &&
    typeof metadata.titleUnicode == 'string' &&
    typeof metadata.artist == 'string' &&
    typeof metadata.artistUnicode == 'string' &&
    typeof metadata.creator == 'string' &&
    typeof metadata.difficult == 'string'

  const validTimingPoints =
    Array.isArray(timingPoints) &&
    timingPoints.length > 0 &&
    timingPoints.every(
      ({ time, bpm, meter, defaultSampleSet, volume }) =>
        typeof time == 'number' &&
        typeof bpm == 'number' &&
        typeof meter == 'number' &&
        typeof volume == 'number' &&
        ['soft', 'normal', 'drum'].includes(defaultSampleSet)
    )

  const isValidHitsound = (hitsound: any) =>
    hitsound != undefined
      ? Array.isArray(hitsound) &&
        hitsound.length <= 2 &&
        hitsound.every(
          ({ type, sampleSet, addition }) =>
            (type != undefined
              ? ['whistle', 'finish', 'clap'].includes(type)
              : true) &&
            (sampleSet != undefined
              ? ['soft', 'normal', 'drum'].includes(sampleSet)
              : true) &&
            (addition != undefined
              ? ['soft', 'normal', 'drum'].includes(addition)
              : true)
        )
      : true

  const validHitObjects =
    Array.isArray(hitObjects) &&
    hitObjects.length > 0 &&
    hitObjects.every(
      ({ type, column, startTime, endTime, hitsound }) =>
        ['note', 'hold'].includes(type) &&
        typeof column == 'number' &&
        typeof startTime == 'number' &&
        (endTime != undefined ? typeof endTime == 'number' : true) &&
        isValidHitsound(hitsound)
    )

  const validBeatmap =
    validAudioPath && validMetadata && validTimingPoints && validHitObjects

  if (!validBeatmap) throw new Error('Invalid beatmap')

  console.log(OFFSET)
  beatmap.timingPoints.forEach((e) => {
    e.time = e.time + OFFSET
  })
  beatmap.hitObjects.forEach((w) => {
    w.startTime = w.startTime + OFFSET
    if (w.endTime) w.endTime = w.endTime + OFFSET
  })
  return beatmap
}
