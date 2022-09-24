import { useEffect } from 'react'
import { Container, Sprite } from '@inlet/react-pixi'
import { Beatmap } from '../../types/Beatmap'
import { Texture } from 'pixi.js'
import Column from './Column'
import {
  WIDTH,
  JUDGEMENT_LINE_OFFSET_Y,
  HEIGHT,
  PLAYFIELD_WIDTH,
} from '../../libs/options'
import { GameState } from '../../state/GameState'
import Cursor from './Cursor'
import CursorNote from './CursorNote'

type PlayFieldProps = {
  beatmap: Beatmap
  game: GameState
}

export default function PlayField(props: PlayFieldProps) {
  return (
    <>
      <Sprite
        texture={Texture.WHITE}
        width={WIDTH}
        height={1}
        y={HEIGHT - JUDGEMENT_LINE_OFFSET_Y}
      />
      <Container>
        <Sprite
          texture={Texture.WHITE}
          width={PLAYFIELD_WIDTH + 30}
          height={HEIGHT}
          x={WIDTH / 2}
          y={HEIGHT / 2}
          anchor={0.5}
          alpha={0.1}
        />
        <Cursor game={props.game} cursors={props.beatmap.cursor}></Cursor>
        <CursorNote
            x={0.5}
            beatmap={props.beatmap}
            key={-1}
            i={-1}
            game={props.game}
          />
        {props.beatmap.cursor.map((hitObject, i) => (
          <CursorNote
            x={hitObject.x}
            beatmap={props.beatmap}
            key={i}
            i={i}
            game={props.game}
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <Column
            i={i + 1}
            key={i}
            hitObjects={props.beatmap.hitObjects.filter(
              (hitObject) => hitObject.column == i + 1
            )}
            timingPoints={props.beatmap.timingPoints}
            game={props.game}
          />
        ))}
      </Container>
    </>
  )
}
