import { MouseEvent, useEffect, useState } from 'react'
import { Container, Sprite, useApp, useTick, Text } from '@inlet/react-pixi'
import {
  BLEND_MODES,
  filters,
  Texture,
  Text as TEXT,
  TextStyle,
  Sprite as SPRITE,
  Container as container,
  ObservablePoint,
  InteractionEvent,
  Rectangle,
} from 'pixi.js'
import {
  WIDTH,
  JUDGEMENT_LINE_OFFSET_Y,
  HEIGHT,
  PLAYFIELD_WIDTH,
  NOTE_TRAVEL_DURATION,
} from '../../../libs/options'
import { GameState } from '../../../state/GameState'
import overlay from '../../../assets/overlay.png'
import { interpolate } from '../../../libs/interpolate'
import { BlurFilter } from '@pixi/filter-blur'
import { generatesquare, generateText } from '../../../libs/frameworks/spritegen'

type Props = {
  time: number
  bpm: number
  game: GameState
}


export default function Menu(props: Props) {
  const timesq = generatesquare(
    'timesq',
    WIDTH / 2,
    HEIGHT,
    WIDTH,
    100,
    [0.5, 0],
    0x000000,
    props.game,
    overlay
  )
  const timesq2 = generatesquare(
    'timesq2',
    WIDTH / 2,
    0,
    WIDTH,
    100,
    [0.5, 0],
    0x000000,
    props.game,
    overlay
  )
  const timestamp = generateText('Timestamp : ', 50, HEIGHT - 80, [0, 1])
  timestamp.scale.x = timestamp.scale.y = 0.7
  timesq.angle = 180
  const timestampcursor = generatesquare(
    'timestampcursor',
    50,
    50,
    10,
    10,
    [0.5, 0.5],
    0xffffff,
    props.game,
  )
  timestampcursor.angle = 45
  const timestampcursorline = generatesquare(
    'tslined',
    50,
    50,
    WIDTH - 100,
    2,
    [0, 0.5],
    0xffffff,
    props.game,
    '',
    true
  )
  const timestampcursorlinehitarea = generatesquare(
    'tsline',
    0,
    50,
    WIDTH,
    100,
    [0, 0.5],
    0xffffff,
    props.game,
    '',
    true
  )
  timestampcursorlinehitarea.alpha = 0
  const tcontainer = new container()
  var time = props.time
  const times = generateText(time.toString(), 50, HEIGHT - 50, [0, 1])
  const handlewheel = (e: WheelEvent) => {
    props.game.currenttime = time
    time +=
      e.deltaY < 0
        ? -Math.round(60000 / props.bpm / 4)
        : Math.round(60000 / props.bpm / 4)
  }

  let inited = false
  function init() {
    if (!inited) {
      document.addEventListener('mousemove', (e) => {
        if (props.game.mousedown == 'tsline') {
          props.game.currenttime = time = Math.round(
            interpolate(
              e.x,
              [50, WIDTH - 50],
              [
                0,
                props.game.beatmap.hitObjects[
                  props.game.beatmap.hitObjects.length - 1
                ].startTime,
              ]
            )
          )
        }
      })
      document.addEventListener('mouseup', () => {
        props.game.mousedown = ''
      })
      document.addEventListener('wheel', handlewheel)
      tcontainer.addChild(timesq)
      tcontainer.addChild(timesq2)
      tcontainer.addChild(times)
      tcontainer.addChild(timestamp)
      tcontainer.addChild(timestampcursor)
      tcontainer.addChild(timestampcursorline)
      tcontainer.addChild(timestampcursorlinehitarea)
    }
  }
  useApp().stage.addChild(tcontainer)
  useTick(() => {
    if (props.game.mode == 'edit') {
      init()
    }
    times.text = time.toString()
    timestampcursor.x = interpolate(
      time,
      [
        0,
        props.game.beatmap.hitObjects[props.game.beatmap.hitObjects.length - 1]
          .startTime,
      ],
      [50, WIDTH - 50]
    )
  })

  return null
}
