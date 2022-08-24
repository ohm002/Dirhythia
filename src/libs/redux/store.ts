import { configureStore } from '@reduxjs/toolkit'
import gameSettingsSlice from './features/gameSettingsSlice'
import gameStateSlice from './features/gameStateSlice'

export const store = configureStore({
  reducer: {
    gameState: gameStateSlice,
    gameSettingsState: gameSettingsSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
