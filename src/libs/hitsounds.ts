import { HitSound } from '../types/HitSound'
import { SampleSet } from '../types/SampleSet'
import normalHitnormal from '../assets/normal-hitnormal.ogg'
import softHitnormal from '../assets/normal-hitnormal.ogg'
import drumHitnormal from '../assets/normal-hitnormal.ogg'

const normalHitnormalAudio = new Audio(normalHitnormal)
const softHitnormalAudio = new Audio(softHitnormal)
const drumHitnormalAudio = new Audio(drumHitnormal)

export const playHitSound = (
  defaultSampleSet: SampleSet,
  hitsound?: HitSound
) => {
  switch (defaultSampleSet) {
    case 'normal':
      normalHitnormalAudio.currentTime = 0
      normalHitnormalAudio.play()
      break

    case 'drum':
      drumHitnormalAudio.currentTime = 0
      drumHitnormalAudio.play()
      break

    default:
      softHitnormalAudio.currentTime = 0
      softHitnormalAudio.play()
      break
  }
}
