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
  Container as container,
  ObservablePoint,
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
import Display from '../play/Display'
import PlayField from '../play/PlayField'
import Time from '../edit/Time'
import { generateText } from '../../../libs/frameworks/spritegen'

type Props = {
  game: GameState
  time: number
  beatmap: Beatmap
}
// function generateText(textstring: string, x: number, y: number) {
//   const text = new TEXT()
//   text.text = textstring
//   text.name = 'playbutton'
//   text.interactive = true
//   text.cursor = 'pointer'
//   text.x = x
//   text.y = y
//   text.anchor.set(0.5, 0.5)
//   text.style = new TextStyle({
//     fill: 'white',
//     dropShadow: true,
//     dropShadowBlur: 0,
//     dropShadowDistance: 4,
//     dropShadowColor: 0xffffff,
//     dropShadowAlpha: 0.5,
//     fontFamily: 'Courier New',
//     fontSize: 25,
//     fontWeight: '900',
//   })
//   return text
// }

const play = generateText('Play', WIDTH / 2, HEIGHT / 2, [0.5, 0.5], true)
const playxy = [100, 130]
const edit = generateText('Edit', WIDTH / 2, HEIGHT / 2 + 30, [0.5, 0.5], true)
export default function Menu(props: Props) {
  const TIME = Date.now() + 1000
  const handlePlay = () => {
    play.alpha = edit.alpha = 0
    play.removeChild()
    edit.removeChild()
    props.game.setVolume(10 / 100)
    props.game.play('play')
  }
  const handleEdit = () => {
    play.alpha = edit.alpha = 0
    play.removeChild()
    edit.removeChild()
    props.game.setVolume(10 / 100)
    props.game.play('edit')
  }
  useTick(() => {
    if (props.game.mode == 'menu') {
      play.alpha = easeOutCubic(Date.now(), [TIME, TIME + 500], [0, 1])
      play.y = easeOutCubic(
        Date.now(),
        [TIME, TIME + 500],
        [playxy[0] - 50, playxy[0]]
      )
      edit.alpha = easeOutCubic(Date.now(), [TIME, TIME + 500], [0, 1])
      edit.y = easeOutCubic(
        Date.now(),
        [TIME, TIME + 500],
        [playxy[1] - 50, playxy[1]]
      )
    }
  })
  play.on('pointerdown', handlePlay)
  edit.on('pointerdown', handleEdit)
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
