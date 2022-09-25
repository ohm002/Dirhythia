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
  PLAYFIELD_WIDTH,
  WIDTH,
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
  let color = 0xff6666
  const [cursorx, setcursorx] = useState(
    WIDTH / 2 - PLAYFIELD_WIDTH / 2 + 0.5 * PLAYFIELD_WIDTH
  )
  if (props.keys == 1 || props.keys == 2) {
    color = 0xa2c0dd
  }
  useTick(() => {
    let playStartTime = props.game.playStartTime
    let isPlaying = props.game.isPlaying
    if (isPlaying) {
      if (props.game.beatmap.cursor.length > 0) {
        let depth = -1
        for (let w = 0; w < props.game.beatmap.cursor.length; w++) {
          const element = props.game.beatmap.cursor[w]
          if (props.startTime < element.startTime) {
            break
          }
          depth++
        }
        if (depth > -1) 
        setcursorx(
          WIDTH / 2 -
            PLAYFIELD_WIDTH / 2 +
            props.game.beatmap.cursor[depth].x * PLAYFIELD_WIDTH
        )
      }
      const currentTime = Date.now() - playStartTime
      props.game.hitlist.forEach((element) => {
        if (element == props.startTime.toString() + props.keys.toString()) {
          setclicked(true)
          setAlpha(0)
        }
      })
      
      setY(
        interpolate(
          currentTime,
          [
            props.startTime -
              NOTE_TRAVEL_DURATION +
              NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
            props.startTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
          ],
          [0, HEIGHT]
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
      } 
      // else {
      //   setEffAlpha(
      //     interpolate(
      //       currentTime,
      //       [props.startTime + 50, props.startTime + 1050],
      //       [0.5, 0]
      //     )
      //   )
      // }
    }
  })
  return (
    <Container>
      <Sprite
        texture={Texture.WHITE}
        x={cursorx - WIDTH / 2 + props.x}
        y={HEIGHT - JUDGEMENT_LINE_OFFSET_Y}
        width={40}
        height={40}
        alpha={effalpha}
        anchor={[0.5, 0.5]}
      />
      <Sprite
        texture={Texture.WHITE}
        x={cursorx - WIDTH / 2 + props.x}
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
