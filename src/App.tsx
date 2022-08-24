import { MouseEventHandler, useEffect, useMemo, useState } from 'react'
import PlayField from './components/game/PlayField'
// import beatmap from './data/Virtual Self - Particle Arts/beatmap'
import beatmap from './data/Reona - Life is beautiful/beatmap'
import { HEIGHT, WIDTH } from './libs/options'
import {
  setEffectVolume,
  setMusicVolume,
} from './libs/redux/features/gameSettingsSlice'
import {
  gamePause,
  gamePlay,
  gameQuit,
  gameRetry,
  setAudioPath,
  setAudioVolume,
} from './libs/redux/features/gameStateSlice'
import { useAppDispatch, useAppSelector } from './libs/redux/hooks'
import ReduxStage from './libs/redux/ReduxStage'

export default function App() {
  const musicVolume = useAppSelector(
    (state) => state.gameSettingsState.musicVolume
  )
  const effectVolume = useAppSelector(
    (state) => state.gameSettingsState.effectVolume
  )
  const score = useAppSelector((state) => state.gameState.score)
  const combo = useAppSelector((state) => state.gameState.combo)
  const dispatch = useAppDispatch()

  const { audioPath } = beatmap

  const handlePlay: MouseEventHandler = (e) => {
    dispatch(setAudioPath(audioPath))
    dispatch(setAudioVolume(musicVolume / 100))
    dispatch(gamePlay())
  }

  const handleQuit: MouseEventHandler = (e) => {
    dispatch(gameQuit())
  }

  useEffect(() => {
    const handleRetry = (e: KeyboardEvent) => {
      switch (e.key) {
        case '`':
          // retry logic
          dispatch(gameRetry())
          break
      }
    }

    document.addEventListener('keydown', handleRetry)

    return () => {
      document.removeEventListener('keydown', handleRetry)
    }
  }, [])

  return (
    <>
      <button className="border border-black py-2 px-3" onClick={handlePlay}>
        Play
      </button>
      <button className="border border-black py-2 px-3" onClick={handleQuit}>
        Quit
      </button>
      <div>
        Music:{' '}
        <input
          type="number"
          min={0}
          max={100}
          step={10}
          value={musicVolume}
          onChange={(e) => {
            dispatch(setMusicVolume(parseInt(e.target.value)))
            dispatch(setAudioVolume(parseInt(e.target.value) / 100))
          }}
        />
      </div>
      <div>
        Effect:{' '}
        <input
          type="number"
          min={0}
          max={100}
          step={10}
          value={effectVolume}
          onChange={(e) => dispatch(setEffectVolume(parseInt(e.target.value)))}
        />
      </div>
      <div>Score: {score}</div>
      <div>Combo: {combo}</div>
      <ReduxStage className="block" width={WIDTH} height={HEIGHT}>
        <PlayField beatmap={beatmap} />
      </ReduxStage>
    </>
  )
}
