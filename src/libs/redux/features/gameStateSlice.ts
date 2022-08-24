import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HitObject } from '../../../types/HitObject'

export type GameState = {
  playStartTime: number
  score: number
  combo: number
  hitlist: Array<HitObject>
  isPlaying: boolean
}

const initialState: GameState = {
  playStartTime: 0,
  score: 0,
  combo: 0,
  hitlist: [],
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
    hitlist: (state, action: PayloadAction<HitObject>) => {
      state.hitlist.push(action.payload)
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

export const {
  hit,
  gamePlay,
  gameQuit,
  gamePause,
  gameResume,
  // combo,
  hitlist,
} = gameStateSlice.actions

export default gameStateSlice.reducer
