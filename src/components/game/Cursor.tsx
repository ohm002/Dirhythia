// import { BLEND_MODES, Texture, Container as container } from 'pixi.js'
import PIXI from 'pixi.js'
import { Sprite, useApp, useTick } from '@inlet/react-pixi'
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
} from '../../libs/options'
import { GameState } from '../../state/GameState'
import { Cursors } from '../../types/Cursors'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  cursors: Cursors[]
  game: GameState
}

// OD 5 equivalent
const maxAcceptableOffset = 150 // ms
const hitWindow300 = 50 // ms
const hitWindow100 = 100 // ms
const hitWindow50 = maxAcceptableOffset // ms

const getColKey = (i: number) => {
  return i > 0 ? CURSOR_LEFT_KEY : i < 0 ? CURSOR_RIGHT_KEY : undefined
}

export default function Cursor(props: Props) {
  const [x, setX] = useState(0.5)
  const [nextObjIndex, setNextObjIndex] = useState(0)
  let playStartTime = props.game.playStartTime
  const nextObj = useMemo(() => props.cursors[nextObjIndex], [nextObjIndex])
  const app = useApp()
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
        if (currentTime >= element.startTime && nexttime >= currentTime && element.type == "normal") {
          setX(element.x)
        }
      }
      if (nextObj != undefined) {
        if (currentTime > nextObj.startTime + 150) {
          props.game.miss(nextObj.startTime, 5)
          setNextObjIndex(nextObjIndex + 1)
        }
      }
    }
  })
  useEffect(() => {
    function validmouse(i: number) {
      if (nextObj) {
        if (x > nextObj.x && i < 0) {
          return true
        } else if (x < nextObj.x && i > 0) {
          return true
        }
      }
    }
    if (props.game.mode == 'play') {
      document.addEventListener('mousemove', (e: MouseEvent) => {
        if (Math.abs(e.movementX) >= 0 && validmouse(e.movementX)) {
          const currentTime = Date.now() - playStartTime
          // find the hit object that player tried to click
          const clickedHitObject =
            nextObj.startTime >= currentTime - maxAcceptableOffset &&
            nextObj.startTime <= currentTime + maxAcceptableOffset
              ? nextObj
              : undefined
          if (clickedHitObject) {
            const offset = Math.abs(clickedHitObject.startTime - currentTime)
            var result = async () => {
              await props.game
                .hit("perfect", clickedHitObject.startTime, 5)
                .then((res) => {
                  if (res){
                    setNextObjIndex(nextObjIndex + 1)
                  }
                })
            }
            result()
          }
        }
      })
    }
    return () => {}
  }, [nextObj, x])
  return (null)
}
