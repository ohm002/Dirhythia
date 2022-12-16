import { useEffect, useState } from 'react'
import { Container, Sprite, useApp, useTick, Text } from '@inlet/react-pixi'
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
} from 'pixi.js'
import {
  WIDTH,
  JUDGEMENT_LINE_OFFSET_Y,
  HEIGHT,
  PLAYFIELD_WIDTH,
  NOTE_TRAVEL_DURATION,
} from '../../../libs/options'
import { GameState } from '../../../state/GameState'

type Props = {
  time: number
  bpm: number
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
const play = generateText('0', WIDTH / 2, HEIGHT / 2)
export default function Menu(props: Props) {
  useEffect(() => {
    var time = props.time
    const handlewheel = (e: WheelEvent) => {
      time += Math.round(60000 / props.bpm / 4)
      play.text = time
      //   else if (e.dFeltaY < 0) settime(time - 50)
    }
    document.addEventListener('wheel', handlewheel)
    return () => {
      document.removeEventListener('wheel', handlewheel)
    }
  }, [])
  useApp().stage.addChild(play)
  return null
}
