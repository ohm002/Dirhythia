import { MouseEventHandler, useEffect } from 'react'
import PlayField from './components/game/play/PlayField'
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
import Display from './components/game/play/Display'
import Menu from './components/game/menu/Menu'
import css from './index.css'
import { parseBeatmap } from './libs/parseBeatmap'
import { Beatmap } from './types/Beatmap'
import { Application, TextStyle } from 'pixi.js'
import { Text } from 'pixi.js'
type AppProps = {
  chart: Beatmap
  game: GameState
}

export default function MenuWindow(props: AppProps) {
  const GAME = props.game
  useTick(() => {
    console.log(GAME.mode)
  })
  return (
    <>
      {/* <div>
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
          /> */}
      {/* </div> */}
      <div id="display"></div>
      {/* <input type="range" id="range" onInput={rangehandler}></input> */}
      {GAME.mode == 'menu' ? (
        <Stage width={WIDTH} height={HEIGHT}>
          <Menu game={props.game}></Menu>
        </Stage>
      ) : null}
    </>
  )
}
