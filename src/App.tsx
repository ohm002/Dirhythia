import { MouseEventHandler, useEffect } from 'react'
import PlayField from './components/game/PlayField'
import beatmap from './data/Virtual Self - Particle Arts/beatmap'
// import beatmap from './data/Reona - Life is beautiful/beatmap'
import { GameState } from './state/GameState'
import { HEIGHT, OFFSET, WIDTH } from './libs/options'
import { Stage } from '@inlet/react-pixi'
import Display from './components/game/Display'
import { parseBeatmap } from './libs/parseBeatmap'

export default function App() {
  const { audioPath } = beatmap
  beatmap.timingPoints.forEach((e) => {
    e.time = e.time + OFFSET
  })
  beatmap.hitObjects.forEach((w) => {
    w.startTime = w.startTime + OFFSET
    if (w.endTime) w.endTime = w.endTime + OFFSET
  })
  let maxscore = 0
  beatmap.hitObjects.forEach((e) => {
    maxscore += 300
  })

  beatmap.cursor.forEach((e, i) => {
    if (beatmap.cursor[i - 1]) {
      if (beatmap.cursor[i - 1].x != e.x) {
        console.log(beatmap.cursor[i - 1].x, e.x)
        maxscore += 300
      }
    } else {
      maxscore += 300
    }
  })
  const GAME = new GameState(10, 10, 400, audioPath, maxscore)
  GAME.setAudioPath(audioPath)
  GAME.audio.load()
  const musicVolume = GAME.audiovolume
  const songlength = GAME.audio.duration
  const effectVolume = GAME.effectvolume
  let combo = GAME.combo
  let score = GAME.score

  const handlePlay: MouseEventHandler = (e) => {
    GAME.setVolume(musicVolume / 100)
    GAME.play()
  }

  const handleQuit: MouseEventHandler = (e) => {
    GAME.quit()
  }

  useEffect(() => {
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
        <Display game={GAME}></Display>
        <PlayField beatmap={beatmap} game={GAME} />
      </Stage>
      <div id="log"></div>
    </>
  )
}
