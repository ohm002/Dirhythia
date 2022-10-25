import { loadhitsound, playHitSound } from '../libs/hitsounds'
import { WIDTH } from '../libs/options'
import { Beatmap } from '../types/Beatmap'
import axios from 'axios'

const audioctx = new AudioContext()
const GAME_AUDIO = new Audio()

await loadhitsound()
export class GameState {
  // data: JSON
  audiovolume: number
  audio: any
  hitlist: string[]
  effectvolume: number
  scrollspeed: number
  score: number
  maxscore: number
  combo: number
  playStartTime: number
  cursor: number
  audiopath: string
  isPlaying: boolean
  key: string[]
  currenttime: number
  beatmap: Beatmap

  constructor(
    volume: number,
    effect: number,
    scrollspeed: number,
    audiopath: string,
    maxscore: number,
    beatmap: Beatmap
  ) {
    // this.data = [
    //   {
    //     apath: audiopath,
    //   },
    //   {}
    // ]
    // 0 : AUDIOPATH
    // 1 : AUDIOVOL
    // 2 : EFFECTVOL
    // 3 : SCROLLSPEED
    // 4 : SCORE
    // 5 : COMBO
    // 6 : PLAYSTARTTIME
    // 7 : ISPLAYING
    // 8 : CURSOR
    // 9 : HITLIST
    this.beatmap = beatmap
    this.key = ['00', '00', '00', '00', '00', '00']
    this.audio = GAME_AUDIO
    this.audiopath = audiopath
    this.audiovolume = volume
    GAME_AUDIO.src = this.audiopath
    this.effectvolume = effect
    this.scrollspeed = scrollspeed
    this.score = 0
    this.maxscore = maxscore
    this.combo = 0
    this.playStartTime = 0
    this.isPlaying = false
    this.cursor = 0.5
    this.currenttime = 0
    this.hitlist = []
  }

  play() {
    this.isPlaying = true
    this.score = 0
    this.combo = 0
    this.playStartTime = Date.now()
    this.hitlist = []

    GAME_AUDIO.currentTime = 0
    GAME_AUDIO.play()
  }

  retry() {
    this.isPlaying = true
    this.score = 0
    this.combo = 0
    this.playStartTime = Date.now()
    this.hitlist = []

    GAME_AUDIO.currentTime = 0
    GAME_AUDIO.play()
  }
  quit() {
    this.isPlaying = false
    this.score = 0
    this.combo = 0
    this.playStartTime = 0
    this.hitlist = []

    GAME_AUDIO.pause()
    GAME_AUDIO.currentTime = 0
  }
  async hit(score: number, time: number, key: number) {
    let valid = true
    this.hitlist.forEach((element) => {
      if (element == time.toString() + key.toString() && key < 6) {
        valid = false
      }
    })
    if (valid) {
      await playHitSound(10, 'normal')
      this.score += score
      this.combo += 1
      this.hitlist.push(time.toString() + key.toString())
      return true
    } else {
      return false
    }
  }

  miss(time: number, key: number) {
    this.combo = 0
    this.hitlist.push(time.toString() + key.toString())
  }

  setAudioPath(path: string) {
    this.audiopath = path
  }
  setVolume(vol: number) {
    GAME_AUDIO.volume = vol
  }
  setEffectVolume(vol: number) {
    this.effectvolume = vol
  }
}