import { HitSound } from '../types/HitSound'
import { SampleSet } from '../types/SampleSet'
import normalHitnormal from '../assets/hitsounds/normal-hitnormal.ogg'
import softHitnormal from '../assets/hitsounds/soft-hitnormal.wav'
import drumHitnormal from '../assets/hitsounds/drum-hitnormal.wav'

const normalHitnormalAudio = new Audio(normalHitnormal)
const softHitnormalAudio = new Audio(softHitnormal)
const drumHitnormalAudio = new Audio(drumHitnormal)
normalHitnormalAudio.currentTime = 0
export function playHitSound(
  volume: number,
  defaultSampleSet: SampleSet,
  hitsound?: HitSound
) {
  switch (defaultSampleSet) {
    case 'normal':
      normalHitnormalAudio.currentTime = 0
      normalHitnormalAudio.volume = volume / 100
      normalHitnormalAudio.play()
      break

    case 'drum':
      drumHitnormalAudio.currentTime = 0
      drumHitnormalAudio.volume = volume / 100
      drumHitnormalAudio.play()
      break

    default:
      softHitnormalAudio.currentTime = 0
      softHitnormalAudio.volume = volume / 100
      softHitnormalAudio.play()
      break
  }
}
