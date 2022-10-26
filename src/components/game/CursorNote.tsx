import { Container, Sprite, useTick } from '@inlet/react-pixi'
import { BLEND_MODES, filters, Texture, utils } from 'pixi.js'
import { useEffect, useMemo, useState } from 'react'
import { interpolate } from '../../libs/interpolate'
import vertical from '../../assets/vertical.png'
import judgement from '../../assets/judgement.png'
import {
  COLCOLOR,
  COL_WIDTH,
  CURSOR_LEFT_KEY,
  CURSOR_RIGHT_KEY,
  HEIGHT,
  HOLD_WIDTH,
  JUDGEMENT_LINE_OFFSET_Y,
  NOTE_HEIGHT,
  NOTE_TRAVEL_DURATION,
  NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
  OFFSET,
  PLAYFIELD_WIDTH,
  SCROLL_SPEED,
  WIDTH,
} from '../../libs/options'
import { GameState } from '../../state/GameState'
import { Beatmap } from '../../types/Beatmap'
import { TimingPoint } from '../../types/TimingPoint'

type CursorNoteProps = {
  x: number
  game: GameState
  key: number
  i: number
  beatmap: Beatmap
}

export default function CursorNote(props: CursorNoteProps) {
  let isPlaying = props.game.isPlaying
  // console.log(props.game.audio.duration)
  let effectVolume = props.game.effectvolume
  let endTime =
    props.beatmap.cursor[props.i + 1] != undefined
      ? props.beatmap.cursor[props.i + 1].startTime
      : props.game.audio.duration * 1000
  let startTime = props.beatmap.cursor[props.i]
    ? props.beatmap.cursor[props.i].startTime
    : 0
  let startpos = props.beatmap.cursor[props.i]
    ? props.beatmap.cursor[props.i].x
    : 0.5
  let lastpos =
    props.i == 0
      ? 0.5
      : props.beatmap.cursor[props.i - 1] != undefined
      ? props.beatmap.cursor[props.i - 1].x
      : startpos
  let Duration = endTime - startTime
  const height = Math.round((Duration * SCROLL_SPEED) / 1000)
  const [y, setY] = useState(-height - 2)
  let currentTime = 0

  useTick(() => {
    currentTime = props.game.currenttime
    let isPlaying = props.game.isPlaying
    if (isPlaying) {
      setY(
        interpolate(
          currentTime,
          [
            startTime -
              NOTE_TRAVEL_DURATION +
              NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
            endTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
          ],
          [-height-5, HEIGHT]
        )
      )
    }
  })
  const trackalpha = 0.3
  return (
    <Container>
      <Sprite
        texture={Texture.WHITE}
        width={PLAYFIELD_WIDTH * 1.3}
        height={height}
        x={interpolate(
          props.x,
          [0, 1],
          [WIDTH / 2 - PLAYFIELD_WIDTH / 2, WIDTH / 2 + PLAYFIELD_WIDTH / 2]
        )}
        y={y + height}
        tint={0x000000}
        // filters={[new filters.BlurFilter(2)]}
        anchor={[0.5, 1]}
        alpha={1}
      />
      <Sprite
        image={judgement}
        x={interpolate(
          props.x,
          [0, 1],
          [WIDTH / 2 - PLAYFIELD_WIDTH / 2, WIDTH / 2 + PLAYFIELD_WIDTH / 2]
        )}
        y={y + height+105}
        tint={lastpos > startpos ? 0x57d8ff : 0xff5986}
        anchor={lastpos > startpos ? [0, 1] : [1, 1]}
        alpha={1}
        width={Math.abs(lastpos - startpos) * PLAYFIELD_WIDTH}
        blendMode={BLEND_MODES.ADD}
        height={200}
      />
      <Sprite
        texture={Texture.WHITE}
        tint={COLCOLOR[0]}
        x={interpolate(
          props.x,
          [0, 1],
          [
            WIDTH / 2 - PLAYFIELD_WIDTH / 2 - COL_WIDTH,
            WIDTH / 2 + PLAYFIELD_WIDTH / 2 - COL_WIDTH,
          ]
        )}
        alpha={.1}
        y={y + height}
        anchor={[1, 1]}
        height={height}
        width={COL_WIDTH}
      />
      <Sprite
        texture={Texture.WHITE}
        tint={COLCOLOR[1]}
        x={interpolate(
          props.x,
          [0, 1],
          [WIDTH / 2 - PLAYFIELD_WIDTH / 2, WIDTH / 2 + PLAYFIELD_WIDTH / 2]
        )}
        alpha={trackalpha}
        y={y + height}
        anchor={[1, 1]}
        height={height}
        width={COL_WIDTH}
      />
      <Sprite
        texture={Texture.WHITE}
        tint={COLCOLOR[2]}
        x={interpolate(
          props.x,
          [0, 1],
          [WIDTH / 2 - PLAYFIELD_WIDTH / 2, WIDTH / 2 + PLAYFIELD_WIDTH / 2]
        )}
        alpha={trackalpha}
        y={y + height}
        anchor={[0, 1]}
        height={height}
        width={COL_WIDTH}
      />
      <Sprite
        texture={Texture.WHITE}
        tint={COLCOLOR[3]}
        x={interpolate(
          props.x,
          [0, 1],
          [
            WIDTH / 2 - PLAYFIELD_WIDTH / 2 + COL_WIDTH,
            WIDTH / 2 + PLAYFIELD_WIDTH / 2 + COL_WIDTH,
          ]
        )}
        y={y + height}
        alpha={.1}
        anchor={[0, 1]}
        height={height}
        width={COL_WIDTH}
      />
      <Sprite
        image={vertical}
        x={interpolate(
          props.x,
          [0, 1],
          [WIDTH / 2 - PLAYFIELD_WIDTH / 2, WIDTH / 2 + PLAYFIELD_WIDTH / 2]
        )}
        y={y + height}
        anchor={[0.5, 1]}
        alpha={1}
        blendMode={BLEND_MODES.ADD}
        width={100}
        height={height}
      />
      <Sprite
        image={vertical}
        x={interpolate(
          props.x,
          [0, 1],
          [
            WIDTH / 2 - PLAYFIELD_WIDTH / 2 - PLAYFIELD_WIDTH / 2,
            WIDTH / 2 + PLAYFIELD_WIDTH / 2 - PLAYFIELD_WIDTH / 2,
          ]
        )}
        y={y + height}
        anchor={[0.5, 1]}
        alpha={.2}
        blendMode={BLEND_MODES.ADD}
        width={100}
        height={height}
      />

      <Sprite
        image={vertical}
        x={interpolate(
          props.x,
          [0, 1],
          [
            WIDTH / 2 - PLAYFIELD_WIDTH / 2 + PLAYFIELD_WIDTH / 2,
            WIDTH / 2 + PLAYFIELD_WIDTH / 2 + PLAYFIELD_WIDTH / 2,
          ]
        )}
        y={y + height}
        anchor={[0.5, 1]}
        alpha={.2}
        blendMode={BLEND_MODES.ADD}
        width={100}
        height={height}
      />
    </Container>
  )
}
