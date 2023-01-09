import axios from 'axios'
import { triggereffect } from '../components/game/play/Display'
import { misseff } from '../components/game/play/PlayField'
import { AudioEngine } from '../libs/audio/engine'
import { playhs } from '../libs/hitsounds'
// import { getaudio } from '../libs/audio/audiofuncs'
import { HEIGHT, JUDGEMENT_LINE_OFFSET_Y, SCROLL_SPEED } from '../libs/options'
import { getHeight, getWidth } from '../libs/screenhandler'
import { Beatmap } from '../types/Beatmap'

const GAME_AUDIO = new Audio()
export class GameState {
  // data: JSON
  audiovolume: number
  audio: any
  hitlist: Array<any>
  effectvolume: number
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
  beatmap: Beatmap | any
  maxcombo: number
  notespeed: number
  WIDTH: number
  HEIGHT: number

  constructor() {
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
    this.beatmap = null
    this.key = ['00', '00', '00', '00', '00']
    this.audio = GAME_AUDIO
    this.audiopath = ''
    this.audiovolume = NaN
    this.effectvolume = NaN
    this.highestcombo = 0
    this.hitwaitlist = []
    this.maxcombo = NaN
    this.score = 0
    this.notespeed = 0
    this.maxscore = NaN
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
  init(
    volume: number,
    effect: number,
    scrollspeed: number,
    audiopath: string,
    maxscore: number,
    beatmap: Beatmap,
    notespeed: number,
    maxcombo: number
  ) {
    this.audiovolume = volume
    this.effectvolume = effect
    this.audiopath = audiopath
    this.notespeed = notespeed
    this.maxscore = maxscore
    this.maxcombo = maxcombo
    this.beatmap = beatmap
    GAME_AUDIO.src = audiopath
    return this
  }
  NOTE_TRAVEL_DURATION() {
    return (HEIGHT / this.notespeed) * 1000
  }
  NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION() {
    return (JUDGEMENT_LINE_OFFSET_Y / this.notespeed) * 1000
  }
  async miss(time: number, key: number) {
    if (
      this.hitlist.filter(
        (a) => a == time.toString() + key.toString() + ',miss'
      ).length == 0
    ) {
      this.combo = 0
      this.hitlist.push(time.toString() + key.toString() + ',miss')
      triggereffect(this.currenttime, 'miss')
      misseff(this.currenttime)
    }
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

    playhs()
    this.hitlist.push(time.toString() + key.toString() + ',' + score)
    // this.hitwaitlist = this.hitwaitlist.filter((item) => item !== element)
    triggereffect(time, score)
  }

  async play() {
    this.isPlaying = true
    this.score = 0
    this.combo = 0
    this.playStartTime = Date.now()
    this.hitlist = []
    this.mode = 'play'
    // const hsResponse = await axios.get(this.audiopath, {
    //   responseType: 'arraybuffer',
    //   withCredentials: true,
    // })
    // const buffer = await hsResponse.data
    // sound = await sengine.createSample(buffer)
    // return sound
    if (this.mode == 'play') GAME_AUDIO.play()
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
