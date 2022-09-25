import { Container, Sprite, useTick } from '@inlet/react-pixi'
import { Texture } from 'pixi.js'
import { useEffect, useMemo, useState } from 'react'
import { interpolate } from '../../libs/interpolate'
import {
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
  const [y, setY] = useState(0)

  useTick(() => {
    let playStartTime = props.game.playStartTime
    let isPlaying = props.game.isPlaying
    if (isPlaying) {
      const currentTime = Date.now() - playStartTime
      setY(
        interpolate(
          currentTime,
          [
            startTime -
              NOTE_TRAVEL_DURATION +
              NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
            endTime + NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION,
          ],
          [-height, HEIGHT]
        )
      )
    }
  })
  return (
    <Container>
      <Sprite
        texture={Texture.WHITE}
        tint={0x1f1f1f}
        width={PLAYFIELD_WIDTH + 30}
        height={height}
        x={Math.round(
          WIDTH / 2 - PLAYFIELD_WIDTH / 2 + props.x * PLAYFIELD_WIDTH
        )}
        y={y + height}
        anchor={[0.5,1]}
        alpha={1}
      />
      <Sprite
        texture={Texture.WHITE}
        x={Math.round(
          WIDTH / 2 - PLAYFIELD_WIDTH / 2 + props.x * PLAYFIELD_WIDTH
        )}
        y={y + height}
        anchor={lastpos > startpos ? [0, 1] : [1, 0]}
        width={Math.abs(lastpos - startpos) * PLAYFIELD_WIDTH}
        height={2}
      />
      <Sprite
        texture={Texture.WHITE}
        x={Math.round(
          WIDTH / 2 - PLAYFIELD_WIDTH / 2 + props.x * PLAYFIELD_WIDTH
        )}
        y={y + height}
        anchor={[0.5, 1]}
        width={2}
        height={height}
      />
    </Container>
  )
}
