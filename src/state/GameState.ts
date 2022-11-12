import { triggereffect } from '../components/game/Display'
import { WIDTH } from '../libs/options'
import { Beatmap } from '../types/Beatmap'

const audioctx = new AudioContext()
const GAME_AUDIO = new Audio()

export class GameState {
  // data: JSON
  audiovolume: number
  audio: any
  hitlist: Array<any>
  effectvolume: number
  scrollspeed: number
  score: number
  maxscore: number
  combo: number
  playStartTime: number
  cursor: number
  audiopath: string
  mode: string
  isPlaying: boolean
  key: Array<any>
  currenttime: number
  highestcombo: number
  beatmap: Beatmap
  maxcombo: number

  constructor(
    volume: number,
    effect: number,
    scrollspeed: number,
    audiopath: string,
    maxscore: number,
    beatmap: Beatmap,
    maxcombo: number
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
    this.key = ['00', '00', '00', '00', 0, 0]
    this.audio = GAME_AUDIO
    this.audiopath = audiopath
    this.audiovolume = volume
    GAME_AUDIO.src = this.audiopath
    this.effectvolume = effect
    this.scrollspeed = scrollspeed
    this.highestcombo = 0
    this.maxcombo = maxcombo
    this.score = 0
    this.maxscore = maxscore
    this.combo = 0
    this.playStartTime = 0
    this.isPlaying = false
    this.cursor = 0.5
    this.mode = ''
    this.currenttime = 0
    this.hitlist = []
  }

  async miss(time: number, key: number) {
    this.combo = 0
    this.hitlist.push(time.toString() + key.toString() + 'miss')
  }

  async hit(score: string, time: number, key: number) {
    let valid = true
    this.hitlist.forEach((element) => {
      if (element.startsWith(time.toString() + key.toString())) {
        valid = false
      }
    })
    if (valid) {
      this.score += this.idtoscore(score)
      this.combo += 1
      if (this.combo > this.highestcombo) this.highestcombo = this.combo
      triggereffect(time, score)
      this.hitlist.push(time.toString() + key.toString() + ',' + score)
      return true
    } else {
      return false
    }
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
  idtoscore(input: string): number {
    switch (input) {
      case 'perfect':
        return 100
      case 'great':
        return 50
      case 'ok':
        return 30
      default:
        return 0
    }
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
