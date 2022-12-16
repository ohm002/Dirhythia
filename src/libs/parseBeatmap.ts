import { Beatmap } from '../types/Beatmap'
import { OFFSET } from './options'

export function parseBeatmap(data: string): Beatmap {
  // todo :
  // sort by time in case someone fuck up the order
  const beatmap = JSON.parse(data) as Beatmap

  const {
    audioPath,
    metadata,
    hitObjects,
    timingPoints,
    cursor,
    speedChanges,
  } = beatmap

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

  beatmap.timingPoints.forEach((e) => {
    e.time = e.time + OFFSET
  })
  beatmap.hitObjects.forEach((w) => {
    w.startTime = w.startTime + OFFSET
    if (w.endTime) w.endTime = w.endTime + OFFSET
  })
  if (beatmap.speedChanges != undefined)
    beatmap.speedChanges = beatmap.speedChanges.sort(
      (a, b) => a.startTime - b.startTime
    )
  beatmap.cursor = beatmap.cursor.sort((a, b) => a.startTime - b.startTime)
  beatmap.cursor.forEach((w, i) => {
    w.startTime = w.startTime + OFFSET
  })
  beatmap.timingPoints.forEach((w, i) => {
    w.time = w.time + OFFSET
  })
  return beatmap
}
