import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type GameSettings = {
  musicVolume: number
  effectVolume: number
  scrollSpeed: number
}

const initialState: GameSettings = {
  musicVolume: 10,
  effectVolume: 10,
  scrollSpeed: 4,
}

export const gameSettingsSlice = createSlice({
  name: 'gameSettingsState',
  initialState,
  reducers: {
    setMusicVolume: (state, action: PayloadAction<number>) => {
      state.musicVolume = action.payload
    },
    setEffectVolume: (state, action: PayloadAction<number>) => {
      state.effectVolume = action.payload
    },
    setScrollSpeed: (state, action: PayloadAction<number>) => {
      state.scrollSpeed = action.payload
    },
  },
})

export const { setMusicVolume, setEffectVolume, setScrollSpeed } =
  gameSettingsSlice.actions

export default gameSettingsSlice.reducer
