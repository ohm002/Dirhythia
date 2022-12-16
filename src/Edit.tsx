import { MouseEventHandler, useEffect, useState } from 'react'
import PlayField from './components/game/play/PlayField'
// import beatmap from './data/Virtual Self - Particle Arts/beatmap'
// import beatmap from './data/void(Mournfinale) - World Vanquisher/beatmap'
// import beatmap from './data/Reona - Life is beautiful/beatmap'
import { GameState } from './state/GameState'
import MenuWindow from './MenuWindow'
import Menu from './components/game/menu/Menu'
import Time from './components/game/edit/Time'
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
  SCROLL_SPEED,
} from './libs/options'
import { Stage, useApp, useTick, Container, Text } from '@inlet/react-pixi'
import Display from './components/game/play/Display'
import css from './index.css'
import { parseBeatmap } from './libs/parseBeatmap'
import { Beatmap } from './types/Beatmap'
import { Application, TextStyle, Container as CONTAINER } from 'pixi.js'
// import { Text } from 'pixi.js'
type AppProps = {
  chart: Beatmap
  menutime: number
  game: GameState
}

export default function Edit(props: AppProps) {
  const beatmap = props.chart
    props.game.play()
    //   const { audioPath } = beatmap
  // //   GAME.setAudioPath(audioPath)
  //   const musicVolume = GAME.audiovolume
  //   const effectVolume = GAME.effectvolume
  props.game.mode = "edit"
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
        />
      </div> */}
      <div id="display"></div>
      {/* <input type="range" id="range" onInput={rangehandler}></input> */}

      <Stage width={WIDTH} height={HEIGHT}>
        <Container>
            <Time time={beatmap.timingPoints[0].time} bpm={beatmap.timingPoints[0].bpm} game={props.game}></Time>
          <PlayField beatmap={beatmap} game={props.game} />
        </Container>
      </Stage>
      <div id="log"></div>
    </>
  )
}
