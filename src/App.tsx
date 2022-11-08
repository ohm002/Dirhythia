import { MouseEventHandler, useEffect } from 'react'
import PlayField from './components/game/PlayField'
// import beatmap from './data/Virtual Self - Particle Arts/beatmap'
// import beatmap from './data/void(Mournfinale) - World Vanquisher/beatmap'
// import beatmap from './data/Reona - Life is beautiful/beatmap'
import { GameState } from './state/GameState'
import {
  HEIGHT,
  OFFSET,
  WIDTH,
  COL_1_KEY,
  COL_2_KEY,
  COL_3_KEY,
  COL_4_KEY,
  CURSOR_LEFT_KEY,
  CURSOR_RIGHT_KEY,
  PLAYFIELD_WIDTH,
  JUDGEMENT_LINE_OFFSET_Y,
} from './libs/options'
import { Stage, useApp, useTick, Container } from '@inlet/react-pixi'
import Display from './components/game/Display'
import css from './index.css'
import { parseBeatmap } from './libs/parseBeatmap'
import { Beatmap } from './types/Beatmap'
import { Application, TextStyle } from 'pixi.js'
import { Text } from 'pixi.js'
type AppProps = {
  mode: 'play' | 'editor'
  chart: Beatmap
}

export default function App(props: AppProps) {
  const beatmap = props.chart
  const { audioPath } = beatmap
  beatmap.timingPoints.forEach((e) => {
    e.time = e.time + OFFSET
  })
  beatmap.hitObjects.forEach((w) => {
    w.startTime = w.startTime + OFFSET
    if (w.endTime) w.endTime = w.endTime + OFFSET
  })
  beatmap.cursor.forEach((w) => {
    w.startTime = w.startTime + OFFSET
  })
  let maxscore = 0
  let maxcombo = 0
  beatmap.hitObjects.forEach((e) => {
    maxscore += 100
    maxcombo += 1
  })
  beatmap.cursor.forEach((e, i) => {
    if (beatmap.cursor[i - 1]) {
      if (beatmap.cursor[i - 1].x != e.x) {
        maxscore += 100
        maxcombo += 1
      }
    } else {
      maxscore += 100
      maxcombo += 1
    }
  })
  const GAME = new GameState(
    10,
    10,
    400,
    audioPath,
    maxscore,
    beatmap,
    maxcombo
  )
  GAME.setAudioPath(audioPath)
  const musicVolume = GAME.audiovolume
  const effectVolume = GAME.effectvolume
  GAME.mode = props.mode
  const clearCacheData = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name)
      })
    })
  }
  const handlePlay: MouseEventHandler = (e) => {
    GAME.setVolume(musicVolume / 100)
    GAME.play()
    clearCacheData()
  }
  const handleQuit: MouseEventHandler = (e) => {
    GAME.quit()
  }
  function validkey(key: string) {
    return (
      key == COL_1_KEY ||
      key == COL_2_KEY ||
      key == COL_3_KEY ||
      key == COL_4_KEY ||
      key == CURSOR_LEFT_KEY ||
      key == CURSOR_RIGHT_KEY
    )
  }
  function getkey(key: string) {
    switch (key) {
      case COL_1_KEY:
        return 0
      case COL_2_KEY:
        return 1
      case COL_3_KEY:
        return 2
      case COL_4_KEY:
        return 3
      case CURSOR_LEFT_KEY:
        return 4
      case CURSOR_RIGHT_KEY:
        return 5
      default:
        return NaN
    }
  }
  useEffect(() => {
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if (validkey(e.key)) {
        GAME.key[getkey(e.key)] = '00'
      }
    })

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      GAME.key[getkey(e.key)] = '11'
    })
    const handleRetry = (e: KeyboardEvent) => {
      switch (e.key) {
        case '`':
          // retry logic
          GAME.retry()
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
            GAME.setVolume(parseInt(e.target.value) / 100)
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
          onChange={(e) => GAME.setEffectVolume(parseInt(e.target.value))}
        />
      </div>
      <div id="display"></div>
      <Stage width={WIDTH} height={HEIGHT}>
        <PlayField beatmap={beatmap} game={GAME} />
        <Display game={GAME}></Display>
      </Stage>
      <div id="log"></div>
    </>
  )
}
