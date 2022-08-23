import { configureStore } from '@reduxjs/toolkit'
import gameStateSlice from './features/gameStateSlice'

export const store = configureStore({
  reducer: {
    gameState: gameStateSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch