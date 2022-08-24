import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type GameState = {
  playStartTime: number
  score: number
  isPlaying: boolean
}

const initialState: GameState = {
  playStartTime: 0,
  score: 0,
  isPlaying: false,
}

export const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    hit: (state, action: PayloadAction<number>) => {
      state.score += action.payload
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
      state.playStartTime = Date.now()
    },
    gameQuit: (state) => {
      state.isPlaying = false
      state.score = 0
    },
  },
})

export const { hit, gamePlay, gameQuit, gamePause, gameResume } =
  gameStateSlice.actions

export default gameStateSlice.reducer
