import { Texture } from 'pixi.js'
import { Sprite, useTick } from '@inlet/react-pixi'
import {
  WIDTH,
  HEIGHT,
  JUDGEMENT_LINE_OFFSET_Y,
  COL_WIDTH,
  NOTE_HEIGHT,
  OFFSET,
} from '../../libs/options'
import { GameState } from '../../state/GameState'
import { Cursors } from '../../types/Cursors'
import { current } from '@reduxjs/toolkit'
import { useState } from 'react'

type Props = {
  cursors: Cursors[]
  game: GameState
}

export default function Cursor(props: Props) {
  const [x, setX] = useState(0.5)
  useTick(() => {
    let playStartTime = props.game.playStartTime
    let isPlaying = props.game.isPlaying
    if (isPlaying) {
      const currentTime = Date.now() - playStartTime
      for (let index = 0; index < props.cursors.length; index++) {
        const element = props.cursors[index]
        const nexttime =
          props.cursors[index + 1] != undefined
            ? props.cursors[index + 1].startTime
            : 10000
        if (currentTime >= element.startTime && nexttime >= currentTime) {
          props.game.cursor = element.x
          setX(element.x)
        }
      }
    }
  })
  return (
    <Sprite
      texture={Texture.WHITE}
      x={x * WIDTH}
      y={HEIGHT - JUDGEMENT_LINE_OFFSET_Y}
      anchor={[0.5, 0.5]}
      width={10}
      height={10}
      angle={45}
    />
  )
  // this element is the line and the square on the judgement line
  // try look at my facebook clip no cap
  // todo : cursor animation for 2k mode and 4k mode
}
