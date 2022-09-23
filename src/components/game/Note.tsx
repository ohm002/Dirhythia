import { Container, Sprite, useTick, Text } from '@inlet/react-pixi'
import { Texture, TextStyle } from 'pixi.js'
import { useState } from 'react'
import { interpolate } from '../../libs/interpolate'
import {
  COL_WIDTH,
  HEIGHT,
  JUDGEMENT_LINE_OFFSET_Y,
  NOTE_HEIGHT,
  NOTE_TRAVEL_DURATION,
  NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
  OFFSET,
} from '../../libs/options'
import { GameState } from '../../state/GameState'

type NoteProps = {
  x: number
  startTime: number
  game: GameState
  keys: number
}

export default function Note(props: NoteProps) {
  let [clicked, setclicked] = useState(false)
  const [y, setY] = useState(0)
  const [alpha, setAlpha] = useState(1)
  const [effalpha, setEffAlpha] = useState(0)
  // const color = props.keys == 1 || props.keys == 0 ? 0xffffff : 0xfe0000
  const color = 0xffffff
  // useTick(() => {

  // })
  useTick(() => {
    let playStartTime = props.game.playStartTime
    let isPlaying = props.game.isPlaying
    if (isPlaying) {
      const currentTime = Date.now() - playStartTime
      props.game.hitlist.forEach((element) => {
        if (element == props.startTime.toString() + props.keys.toString()) {
          setclicked(true)
          setAlpha(0)
        }
      })
      if (currentTime > props.startTime + 150 && !clicked) {
        props.game.miss(props.startTime, props.keys)
      }
      setY(
        interpolate(
          currentTime,
          [
            props.startTime -
              NOTE_TRAVEL_DURATION +
              NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
            props.startTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
          ],
          [0, 480]
        )
      )
      if (!clicked) {
        setAlpha(
          interpolate(
            currentTime,
            [
              // 100 will be changed to the time od expires
              props.startTime + 50,
              props.startTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
            ],
            [1, 0]
          )
        )
      } else {
        setEffAlpha(
          interpolate(
            currentTime,
            [props.startTime + 50, props.startTime + 1050],
            [0.5, 0]
          )
        )
      }
    }
  })

  return (
    <Container>
      <Sprite
        texture={Texture.WHITE}
        x={props.x}
        y={HEIGHT - JUDGEMENT_LINE_OFFSET_Y}
        width={40}
        height={40}
        alpha={effalpha}
        anchor={[0.5, 0.5]}
      />
      <Sprite
        texture={Texture.WHITE}
        x={props.x}
        y={y}
        tint={color}
        anchor={[0.5, 1]}
        width={COL_WIDTH}
        height={NOTE_HEIGHT}
        alpha={alpha}
      />
    </Container>
  )
}
