import { triggereffect } from '../components/game/Display'
import { WIDTH } from '../libs/options'
import { getHeight, getWidth } from '../libs/screenhandler'
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
  hitwaitlist: Array<any>
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
  WIDTH: number
  HEIGHT: number

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
    this.key = ['00', '00', '00', '00', '00']
    this.audio = GAME_AUDIO
    this.audiopath = audiopath
    this.audiovolume = volume
    GAME_AUDIO.src = this.audiopath
    this.effectvolume = effect
    this.scrollspeed = scrollspeed
    this.highestcombo = 0
    this.hitwaitlist = []
    this.maxcombo = maxcombo
    this.score = 0
    this.maxscore = maxscore
    this.combo = 0
    this.playStartTime = 0
    this.isPlaying = false
    this.cursor = 0.5
    this.mode = ''
    this.currenttime = 0
    this.HEIGHT = getHeight()
    this.WIDTH = getWidth()
    this.hitlist = []
  }

  async miss(time: number, key: number) {
    this.combo = 0
    this.hitlist.push(time.toString() + key.toString() + 'miss')
    triggereffect(time, 'miss')
  }
  async hit(score: string, time: number, key: number) {
    this.score += this.idtoscore(score)
    this.combo += 1
    if (this.combo > this.highestcombo) this.highestcombo = this.combo
    if (key == 5) {
      this.key[key - 1] = '00'
    } else {
      this.key[key - 1] = '01'
    }
// TODO : MAKETHE CODE ABOVE ACTUALLY GOOD IM SO TIRED RN 
    
    this.hitlist.push(time.toString() + key.toString() + ',' + score)
    // this.hitwaitlist = this.hitwaitlist.filter((item) => item !== element)
    triggereffect(time, score)
  }

  play() {
    this.isPlaying = true
    this.score = 0
    this.combo = 0
    this.playStartTime = Date.now()
    this.hitlist = []
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
