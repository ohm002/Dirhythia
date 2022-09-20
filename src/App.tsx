import { MouseEventHandler, useEffect } from 'react'
import PlayField from './components/game/PlayField'
// import beatmap from './data/Virtual Self - Particle Arts/beatmap'
import beatmap from './data/Reona - Life is beautiful/beatmap'
import { GameState } from './state/GameState'
import { HEIGHT, WIDTH } from './libs/options'
import { Stage } from '@inlet/react-pixi'
import Display from './components/game/Display'

export default function App() {
  const { audioPath } = beatmap
  const GAME = new GameState(10, 10, 400, audioPath)
  const musicVolume = GAME.audiovolume
  const effectVolume = GAME.effectvolume
  let combo = GAME.combo
  let score = GAME.score

  const handlePlay: MouseEventHandler = (e) => {
    GAME.setAudioPath(audioPath)
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
    // document.addEventListener('mousemove', (e: MouseEvent) => {
    //   if (Math.abs(e.movementX) >= 30 ){
    //     console.log(e.movementX);
    //   }
    // })
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
    </>
  )
}
