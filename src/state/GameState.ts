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
    this.mode = ''
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
