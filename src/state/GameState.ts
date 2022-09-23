import { WIDTH } from '../libs/options'

const GAME_AUDIO = new Audio()
export class GameState {
  // data: JSON
  audiovolume: number
  hitlist: string[]
  effectvolume: number
  scrollspeed: number
  score: number
  combo: number
  playStartTime: number
  cursor: number
  audiopath: string
  isPlaying: boolean

  constructor(
    volume: number,
    effect: number,
    scrollspeed: number,
    audiopath: string
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
    this.audiopath = audiopath
    this.audiovolume = volume
    this.effectvolume = effect
    this.scrollspeed = scrollspeed
    this.score = 0
    this.combo = 0
    this.playStartTime = 0
    this.isPlaying = false
    this.cursor = 0.5
    this.hitlist = []
  }

  play() {
    this.isPlaying = true
    GAME_AUDIO.src = this.audiopath
    this.score = 0
    this.combo = 0
    this.playStartTime = Date.now()

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

  hit(score: number, time: number, key: number) {
    this.score += score
    this.combo += 1
    this.hitlist.push(time.toString() + key.toString())
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
