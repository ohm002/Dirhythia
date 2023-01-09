// import { BLEND_MODES, Texture, Container as container } from 'pixi.js'
import PIXI, { TextStyle } from 'pixi.js'
import { Sprite, useApp, useTick, Text } from '@inlet/react-pixi'
import {
  WIDTH,
  HEIGHT,
  JUDGEMENT_LINE_OFFSET_Y,
  COL_WIDTH,
  NOTE_HEIGHT,
  OFFSET,
  PLAYFIELD_WIDTH,
  CURSOR_LEFT_KEY,
  CURSOR_RIGHT_KEY,
  CURSOR_AREA,
} from '../../../libs/options'
import { GameState } from '../../../state/GameState'
import { Cursors } from '../../../types/Cursors'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  cursors: Cursors[]
  game: GameState
}

// OD 5 equivalent
const maxAcceptableOffset = 50 // ms

const getColKey = (i: number) => {
  return i > 0 ? CURSOR_LEFT_KEY : i < 0 ? CURSOR_RIGHT_KEY : undefined
}

export default function Cursor(props: Props) {
  const [x, setX] = useState(0.5)
  const [mouse, setmouse] = useState(-1)
  const [nextObjIndex, setNextObjIndex] = useState(0)
  let playStartTime = props.game.playStartTime
  const nextObj = useMemo(() => props.cursors[nextObjIndex], [nextObjIndex])
  useTick(() => {
    playStartTime = props.game.playStartTime
    let isPlaying = props.game.isPlaying
    if (isPlaying) {
      const currentTime = props.game.currenttime
      for (let index = 0; index < props.cursors.length; index++) {
        const element = props.cursors[index]
        const nexttime =
          props.cursors[index + 1] != undefined
            ? props.cursors[index + 1].startTime
            : props.game.audio.duration * 1000
        if (
          currentTime >= element.startTime &&
          nexttime >= currentTime &&
          element.type == 'normal'
        ) {
          setX(element.x)
        }
      }
      if (props.game.mode == 'play') {
        //   if (e.movementX > 0) {
        //     setmouse(1)
        //   } else {
        //     setmouse(0)
        // }
        // console.log(props.game.key[4], props.game.key[5])
        if (
          ((x > nextObj.x && props.game.key[4][0] == '1') ||
          (x < nextObj.x && props.game.key[4][1] == '1')) && nextObj != undefined
        ) {
          // find the hit object that player tried to click
          const clickedHitObject =
            nextObj.startTime <= currentTime + maxAcceptableOffset
              ? nextObj
              : undefined
          if (clickedHitObject) {
            // console.log('hit', nextObjIndex)
            // const offset = Math.abs(clickedHitObject.startTime - currentTime)
            var result = async () => {
              setNextObjIndex(nextObjIndex + 1)
              await props.game.hit('perfect', clickedHitObject.startTime, 5)
            }
            result()
          }
        }
        if (nextObj != undefined) {
          if (currentTime > nextObj.startTime + maxAcceptableOffset) {
            props.game.miss(nextObj.startTime, 5)
            setNextObjIndex(nextObjIndex + 1)
          }
        }
      }
    }
  })
  return null
  //   <Text
  //     text={mouse > 0 ? 'right' : 'left'}
  //     style={
  //       new TextStyle({
  //         fontFamily: 'Courier New',
  //         align: 'center',
  //         fill: '#ffffff',
  //         fontSize: 20,
  //       })
  //     }
  //   />
}
