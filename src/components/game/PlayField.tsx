import { useEffect } from 'react'
import { Container, Sprite, useApp, useTick } from '@inlet/react-pixi'
import { Beatmap } from '../../types/Beatmap'
import {
  BLEND_MODES,
  filters,
  Texture,
  Text,
  TextStyle,
  Sprite as SPRITE,
} from 'pixi.js'
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
import React from 'react'
import judgement from '../../assets/judgement.png'
import hit from '../../assets/great.png'
import bg from '../../data/void(Mournfinale) - World Vanquisher/87729274_p0.jpg'

type PlayFieldProps = {
  beatmap: Beatmap
  game: GameState
}

export default function PlayField(props: PlayFieldProps) {
  useTick(() => {
    if (props.game.isPlaying) {
      var currentTime = Date.now() - props.game.playStartTime
      props.game.currenttime = currentTime
    }
  })
  return (
    <>
      <Container>
        <Sprite
          image={bg}
          width={WIDTH}
          height={HEIGHT}
          blendMode={BLEND_MODES.ADD}
          filters={[new filters.BlurFilter(20)]}
          alpha={0.2}
        />
        <CursorNote
          x={0.5}
          beatmap={props.beatmap}
          key={-1}
          i={-1}
          type={'normal'}
          game={props.game}
        />
        {props.beatmap.cursor.map((hitObject, i) => (
          <CursorNote
            x={hitObject.x}
            beatmap={props.beatmap}
            key={i}
            i={i}
            type={hitObject.type}
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
      <Cursor game={props.game} cursors={props.beatmap.cursor}></Cursor>
      <Sprite
        width={WIDTH}
        anchor={[0, 0.5]}
        image={judgement}
        y={HEIGHT - JUDGEMENT_LINE_OFFSET_Y}
      />
    </>
  )
}
