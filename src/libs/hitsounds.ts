import { HitSound } from '../types/HitSound'
import { SampleSet } from '../types/SampleSet'
import normalHitnormal from '../assets/hitsounds/normal-hitnormal.ogg'
import softHitnormal from '../assets/hitsounds/soft-hitnormal.wav'
import drumHitnormal from '../assets/hitsounds/drum-hitnormal.wav'
import tap from '../assets/hitsounds/tap.wav'
import axios from 'axios'
import { AudioEngine } from './audio/engine'

const normalHitnormalAudio = new Audio(normalHitnormal)
const softHitnormalAudio = new Audio(softHitnormal)
const drumHitnormalAudio = new Audio(drumHitnormal)
normalHitnormalAudio.currentTime = 0
const sengine = new AudioEngine()
export async function playhs() {
  const hsResponse = await axios.get(drumHitnormal, {
    responseType: 'arraybuffer',
    withCredentials: true,
  })
  const buffer = await hsResponse.data
  const sound = await sengine.createSample(buffer)
  sound.volume = 0.1
  sound.play()
}

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
