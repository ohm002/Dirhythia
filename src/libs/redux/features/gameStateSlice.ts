import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
    gamePause: (state) => {
      state.isPlaying = false
    },
    gameResume: (state) => {
      state.isPlaying = true
    },
    gamePlay: (state) => {
      state.isPlaying = true
      state.score = 0
      state.combo = 0
      state.playStartTime = Date.now()
    },
    gameQuit: (state) => {
      state.isPlaying = false
      state.score = 0
      state.combo = 0
    },
  },
})

export const { hit, miss, gamePlay, gameQuit, gamePause, gameResume } =
  gameStateSlice.actions

export default gameStateSlice.reducer
