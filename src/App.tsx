import { MouseEventHandler, useMemo, useState } from 'react'
import PlayField from './components/game/PlayField'
import beatmap from './data/Virtual Self - Particle Arts/beatmap'
// import beatmap from './data/Reona - Life is beautiful/beatmap'
import { HEIGHT, WIDTH } from './libs/options'
import { gamePlay, gameQuit } from './libs/redux/features/gameStateSlice'
import { useAppDispatch } from './libs/redux/hooks'
import ReduxStage from './libs/redux/ReduxStage'

export default function App() {
  const [volume, setVolume] = useState(10)
  const dispatch = useAppDispatch()

  const { audioPath } = beatmap
  const audio = useMemo(() => new Audio(audioPath), [audioPath])
  audio.volume = volume / 100
  audio.onplay = () => {
    dispatch(gamePlay())
  }

  audio.onpause = () => {
    dispatch(gameQuit())
  }

  const handlePlay: MouseEventHandler = (e) => {
    if (audio.HAVE_ENOUGH_DATA) {
      audio.play()
    }
  }

  const handleQuit: MouseEventHandler = (e) => {
    audio.pause()
    audio.currentTime = 0
  }

  return (
    <>
      <button className="border border-black py-2 px-3" onClick={handlePlay}>
        Play
      </button>
      <button className="border border-black py-2 px-3" onClick={handleQuit}>
        Quit
      </button>
      <div>
        Volume:{' '}
        <input
          type="number"
          min={0}
          max={100}
          step={10}
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
        />
      </div>
      <ReduxStage className="block" width={WIDTH} height={HEIGHT}>
        <PlayField beatmap={beatmap} />
      </ReduxStage>
    </>
  )
}
