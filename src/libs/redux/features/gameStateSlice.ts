import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const GAME_AUDIO = new Audio()

export type GameState = {
  playStartTime: number
  score: number
  combo: number
  isPlaying: boolean
}

const initialState: GameState = {
  playStartTime: 0,
  score: 0,
  combo: 0,
  isPlaying: false,
}

export const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    hit: (state, action: PayloadAction<number>) => {
      state.score += action.payload
      state.combo += 1
    },
    miss: (state) => {
      state.combo = 0
    },
    setAudioPath: (_, action: PayloadAction<string>) => {
      GAME_AUDIO.src = action.payload

      GAME_AUDIO.load()
    },
    setAudioVolume: (_, action: PayloadAction<number>) => {
      GAME_AUDIO.volume = action.payload
    },
    gamePause: (state) => {
      state.isPlaying = false

      GAME_AUDIO.pause()
    },
    gameResume: (state) => {
      state.isPlaying = true

      GAME_AUDIO.play()
    },
    gamePlay: (state) => {
      state.isPlaying = true
      state.score = 0
      state.combo = 0
      state.playStartTime = Date.now()

      GAME_AUDIO.currentTime = 0
      GAME_AUDIO.play()
    },
    gameQuit: (state) => {
      state.isPlaying = false
      state.score = 0
      state.combo = 0

      GAME_AUDIO.pause()
      GAME_AUDIO.currentTime = 0
    },
    gameRetry: (state) => {
      state.isPlaying = true
      state.score = 0
      state.combo = 0
      state.playStartTime = Date.now()

      GAME_AUDIO.currentTime = 0
      GAME_AUDIO.play()
    },
  },
})

export const {
  setAudioPath,
  setAudioVolume,
  hit,
  miss,
  gamePlay,
  gameQuit,
  gamePause,
  gameResume,
  gameRetry,
} = gameStateSlice.actions

export default gameStateSlice.reducer
