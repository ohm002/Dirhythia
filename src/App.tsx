import { Stage } from '@inlet/react-pixi'
import { createContext } from 'react'
import PlayField from './components/game/PlayField'
import beatmap from './data/beatmap'
import { HEIGHT, WIDTH } from './libs/options'
import { HitObject } from './types/HitObject'

export const HitObjectsContext = createContext<HitObject[]>([])

export default function App() {
  return (
    <>
      <Stage className="block" width={WIDTH} height={HEIGHT}>
        <HitObjectsContext.Provider value={beatmap.hitObjects}>
          <PlayField />
        </HitObjectsContext.Provider>
      </Stage>
    </>
  )
}
