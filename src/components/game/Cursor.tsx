import { Texture } from 'pixi.js'
import { Sprite, useTick } from '@inlet/react-pixi'
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
} from '../../libs/options'
import { GameState } from '../../state/GameState'
import { Cursors } from '../../types/Cursors'
import { current } from '@reduxjs/toolkit'
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
  useTick(() => {
    playStartTime = props.game.playStartTime
    let isPlaying = props.game.isPlaying
    if (isPlaying) {
      const currentTime = Date.now() - playStartTime
      for (let index = 0; index < props.cursors.length; index++) {
        const element = props.cursors[index]
        const nexttime =
          props.cursors[index + 1] != undefined
            ? props.cursors[index + 1].startTime
            : 10000
        // CHANGE 10000 TO SONG LENGTH
        if (currentTime >= element.startTime && nexttime >= currentTime) {
          props.game.cursor = element.x
          setX(element.x)
        }
      }
    }
  })
  useEffect(() => {
    if (nextObj && props.cursors[nextObjIndex - 1])
      if (props.cursors[nextObjIndex - 1].x - nextObj.x == 0)
        setNextObjIndex(nextObjIndex + 1)
    const handleKeydown = (e: KeyboardEvent) => {
      console.log(nextObj.x, x)
      if (
        e.key ==
        getColKey(
          props.cursors[nextObjIndex - 1] == undefined
            ? x - nextObj.x
            : props.cursors[nextObjIndex - 1].x - nextObj.x
        )
      ) {
        const currentTime = Date.now() - playStartTime
        // find the hit object that player tried to click
        const clickedHitObject =
          nextObj.startTime >= currentTime - maxAcceptableOffset &&
          nextObj.startTime <= currentTime + maxAcceptableOffset
            ? nextObj
            : undefined
        if (clickedHitObject) {
          const offset = Math.abs(clickedHitObject.startTime - currentTime)
          let valid = true
          props.game.hitlist.forEach((element) => {
            if (element == clickedHitObject.startTime.toString() + 5)
              valid == false
          })
          // if (nextObjIndex != props.cursors.length - 1 && valid)
          setNextObjIndex(nextObjIndex + 1)
          if (offset <= hitWindow300) {
            props.game.hit(300, clickedHitObject.startTime, 5)
          } else if (hitWindow300 < offset && offset <= hitWindow100) {
            props.game.hit(100, clickedHitObject.startTime, 5)
          } else if (hitWindow100 < offset && offset <= hitWindow50) {
            props.game.hit(50, clickedHitObject.startTime, 5)
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeydown)
    // document.addEventListener('mousemove', (e: MouseEvent) => {
    //   // if (Math.abs(e.movementX) >= 50 &&){
    //     console.log(e.movementX);
    //   // }
    // })
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [nextObj, x])
  return (
    <Sprite
      texture={Texture.WHITE}
      x={WIDTH / 2 - PLAYFIELD_WIDTH / 2 + x * PLAYFIELD_WIDTH}
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
