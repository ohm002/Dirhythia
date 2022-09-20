import { useEffect } from 'react'
import { Container, Sprite } from '@inlet/react-pixi'
import { Beatmap } from '../../types/Beatmap'
import { Texture } from 'pixi.js'
import Column from './Column'
import { WIDTH, JUDGEMENT_LINE_OFFSET_Y, HEIGHT } from '../../libs/options'
import { GameState } from '../../state/GameState'
// import Cursor from './Cursor'

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
        {/* <Cursor game={props.game} cursors={props.beatmap.cursor}></Cursor> */}
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
