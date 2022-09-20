import { Container, Sprite, useTick, Text } from '@inlet/react-pixi'
import { Texture, TextStyle } from 'pixi.js'
import { useState } from 'react'
import { interpolate } from '../../libs/interpolate'
import {
  COL_WIDTH,
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
  // let clicked = false
  let [clicked, setclicked] = useState(0)
  const [y, setY] = useState(0)
  const [alpha, setAlpha] = useState(1)
  // const color = props.keys == 1 || props.keys == 0 ? 0xffffff : 0xfe0000
  const color = 0xffffff
  useTick(() => {
    let isPlaying = props.game.isPlaying
    if (isPlaying) {
      props.game.hitlist.forEach((element) => {
      if (
          element ==
          props.startTime.toString() + (props.keys).toString()
        ) {
          setclicked(1)
          // console.log(clicked)
        }
      })
      let playStartTime = props.game.playStartTime
      const currentTime = Date.now() - playStartTime + OFFSET
      if (currentTime > props.startTime + 150 && clicked == 0) {
        props.game.miss(props.startTime, props.keys + 1)
      }
    }
  })
  useTick(() => {
    let playStartTime = props.game.playStartTime
    let isPlaying = props.game.isPlaying
    if (isPlaying) {
      const currentTime = Date.now() - playStartTime + OFFSET
      setY(
        interpolate(
          currentTime,
          [
            props.startTime -
              NOTE_TRAVEL_DURATION +
              NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION +
              OFFSET,
            props.startTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION + OFFSET,
          ],
          [0, 480]
        )
      )

      setAlpha(
        interpolate(
          currentTime,
          [
            // 100 will be changed to the time od expires
            props.startTime + 50 + OFFSET,
            props.startTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION + OFFSET,
          ],
          [1, 0]
        )
      )
    }
  })

  return (
    <Container>
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

      <Text
        text={clicked.toString()}
        anchor={0.5}
        x={props.x}
        y={y}
        style={
          new TextStyle({
            align: 'center',
            fontSize: 20,
            fill: '#fe0000',
          })
        }
      />
    </Container>
  )
}
