import { useEffect, useState } from 'react'
import { Container, Sprite, useApp, useTick, Text } from '@inlet/react-pixi'
import { Beatmap } from '../../../types/Beatmap'
import { TimingPoint } from '../../../types/TimingPoint'
import {
  BLEND_MODES,
  filters,
  Texture,
  Text as TEXT,
  TextStyle,
  Sprite as SPRITE,
  TextureLoader,
  Loader,
  Container as container,
} from 'pixi.js'
import {
  WIDTH,
  JUDGEMENT_LINE_OFFSET_Y,
  HEIGHT,
  PLAYFIELD_WIDTH,
  NOTE_TRAVEL_DURATION,
} from '../../../libs/options'
import { GameState } from '../../../state/GameState'
import React from 'react'
import { interpolate } from '../../../libs/interpolate'

type Props = {
  game: GameState
}

const text = new TEXT()
text.text = 'play'
text.name = 'playbutton'
text.interactive = true
text.cursor = 'pointer'
text.x = WIDTH / 2
text.y = HEIGHT / 2
text.style = new TextStyle({
  fontFamily: 'Goldman',
  align: 'center',
  fill: '#ffffff',
  fontSize: 17,
})
export default function PlayField(props: Props) {
  const handlePlay = () => {
    props.game.setVolume(10 / 100)
    props.game.play()
    text.alpha = 0
  }
  text.on('pointerdown', handlePlay)
  useApp().stage.addChild(text)
  return null
}
