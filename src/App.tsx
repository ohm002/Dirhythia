import { MouseEventHandler, useEffect } from 'react'
import PlayField from './components/game/play/PlayField'
// import beatmap from './data/Virtual Self - Particle Arts/beatmap'
// import beatmap from './data/void(Mournfinale) - World Vanquisher/beatmap'
// import beatmap from './data/Reona - Life is beautiful/beatmap'
import { GameState } from './state/GameState'
import MenuWindow from './MenuWindow'
import Menu from './components/game/menu/Menu'
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
import Display from './components/game/play/Display'
import css from './index.css'
import { parseBeatmap } from './libs/parseBeatmap'
import { Beatmap } from './types/Beatmap'
import { Application, TextStyle } from 'pixi.js'
import { Text } from 'pixi.js'
type AppProps = {
  chart: Beatmap
  game: GameState
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
  // add slam support
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
  const GAME = props.game.init(
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
    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (e.movementX > 0) GAME.key[4] = GAME.key[4][0] + '1'
      if (e.movementX < 0) GAME.key[4] = '1' + GAME.key[4][1]
    })
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if (validkey(e.key)) {
        GAME.key[getkey(e.key)] = '00'
      }
    })
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      // console.log(e.repeat)
      if (!e.repeat) {
        GAME.key[getkey(e.key)] = '11'
      } else {
        GAME.key[getkey(e.key)] = '01'
      }
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
  // const rangehandler = (e) => {
  //   if(GAME.mode == 'editor'){
  //     GAME.currenttime = (e.target.value / 100) * beatmap.hitObjects[beatmap.hitObjects.length-1].startTime
  //     console.log(GAME.currenttime)
  //   }
  // }
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
      {/* <input type="range" id="range" onInput={rangehandler}></input> */}

      <Stage width={WIDTH} height={HEIGHT}>
        <Menu game={GAME} />
        <Container>
          <PlayField beatmap={beatmap} game={GAME} />
          <Display game={GAME} />
        </Container>
      </Stage>
      <div id="log"></div>
    </>
  )
}
