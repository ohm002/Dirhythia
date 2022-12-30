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
  ObservablePoint,
  Ticker,
  Graphics,
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
import { easeOutCubic, interpolate } from '../../../libs/interpolate'

type Props = {
  game: GameState
  time: number
}
function generateText(textstring: string, x: number, y: number) {
  const text = new TEXT()
  text.text = textstring
  text.name = 'playbutton'
  text.interactive = true
  text.cursor = 'pointer'
  text.x = x
  text.y = y
  text.anchor.set(0.5, 0.5)
  text.style = new TextStyle({
    fontFamily: 'Goldman',
    align: 'center',
    fill: '#ffffff',
    fontSize: 25,
    dropShadow: true,
    dropShadowBlur: 5,
    dropShadowDistance: 0,
    dropShadowColor: 0xffffff,
  })
  return text
}
const play = generateText('Play', WIDTH / 2, HEIGHT / 2)
const playxy = [play.x,play.y]
const edit = generateText('Edit', WIDTH / 2, HEIGHT / 2 + 30)
export default function Menu(props: Props) {
  const TIME = Date.now() + 1000
  const handlePlay = () => {
    props.game.setVolume(10 / 100)
    props.game.play()
    play.alpha = 0
    edit.alpha = 0
  }
  useTick(() => {
    if (props.game.mode == 'menu') {
      play.alpha = easeOutCubic(Date.now(), [TIME, TIME + 500], [0, 1])
      play.x = easeOutCubic(Date.now(), [TIME, TIME + 500], [playxy[0]-50, playxy[0]])
      // play.scale.x = play.scale.y = easeOutCubic(Date.now(), [TIME, TIME + 500], [0, 1])
      // edit.scale.x = play.scale.y = easeOutCubic(Date.now(), [TIME, TIME + 500], [0, 1])
      edit.alpha = easeOutCubic(Date.now(), [TIME, TIME + 500], [0, 1])
      edit.x = easeOutCubic(Date.now(), [TIME, TIME + 500], [playxy[0]-50, playxy[0]])
    }
  })
  play.on('pointerdown', handlePlay)
  // const curve = new Graphics();
  
  // curve.lineStyle(2, 0xFFFFFF, 1);
  // curve.beginFill(0x1f1f1f);
  // curve.moveTo(20, 20);
  // curve.bezierCurveTo(20, 20,58, 100, 100, 100);  
  // curve.bezierCurveTo(100, 100, 100, 100, 100+50, 100);
  // curve.bezierCurveTo(100+50, 100,58+50, 100, 20+50, 20);
  // curve.bezierCurveTo(20+50, 20,20+50, 20, 20, 20);
  // curve.endFill();
  useApp().stage.addChild(play)
  // useApp().stage.addChild(curve)
  useApp().stage.addChild(edit)
  return null
}
