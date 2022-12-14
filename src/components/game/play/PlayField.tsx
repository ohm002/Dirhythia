import { useEffect, useState } from 'react'
import { Container, Sprite, useApp, useTick } from '@inlet/react-pixi'
import { Beatmap } from '../../../types/Beatmap'
import { TimingPoint } from '../../../types/TimingPoint'
import {
  BLEND_MODES,
  filters,
  Texture,
  Text,
  TextStyle,
  Sprite as SPRITE,
  Container as CONTAINER,
  Filter,
} from 'pixi.js'
import Column from './Column'
import {
  WIDTH,
  JUDGEMENT_LINE_OFFSET_Y,
  HEIGHT,
  PLAYFIELD_WIDTH,
  NOTE_TRAVEL_DURATION,
  SCROLL_SPEED,
} from '../../../libs/options'
import { GameState } from '../../../state/GameState'
import Cursor from './Cursor'
import CursorNote, { BPMLine } from './CursorNote'
import React from 'react'
import judgement from '../../../assets/judgement.png'
import judgement2 from '../../../assets/judgement2.png'
import { easeOutCubic, interpolate } from '../../../libs/interpolate'
import { NoteSpeedModifier } from '../../../types/NoteSpeedModifier'
import { BloomFilter, RGBSplitFilter } from 'pixi-filters'
import { BlurFilter } from '@pixi/filter-blur'

type PlayFieldProps = {
  beatmap: Beatmap
  game: GameState
}
const rgb = new RGBSplitFilter()
const bloom = new BloomFilter()
const blur = new BlurFilter(0)
const container = new CONTAINER()

let misstime = -1

export function misseff(time: number) {
  misstime = time
}

export default function PlayField(props: PlayFieldProps) {
  const app = useApp()
  let b = false
  if (b == false) {
    app.stage.filters = [rgb, blur]
    bloom.blur = 5
    rgb.blue = [2, 0]
    rgb.green = [0, 0]
    rgb.red = [-2, 0]
    b = true
  }
  const bgimage = SPRITE.from(props.beatmap.bgPath)
  if (app.stage.getChildByName('bgimage') == null) app.stage.addChild(bgimage)
  app.stage.addChild(container)
  const [active, setactive] = useState(0)
  bgimage.alpha = 0
  bgimage.name = 'bgimage'
  // const app = useApp()
  // const observer = new ResizeObserver(([entry]) => {
  //   function getWidth() {
  //     return Math.max(
  //       document.body.offsetWidth,
  //       document.documentElement.offsetWidth,
  //       document.documentElement.clientWidth
  //     )
  //   }
  //   function getHeight() {
  //     return Math.max(document.documentElement.clientHeight)
  //   }
  //   app.renderer.resize(getWidth(), getHeight())
  //   console.log(getWidth(), getHeight(),app.renderer.width, app.renderer.height)
  // })
  // observer.observe(document.getElementsByTagName('html')[0])
  const GAME = props.game
  const timinglist = (
    (props.game.beatmap as Beatmap).timingPoints as TimingPoint[]
  ).sort((a, b) => a.time - b.time)
  let currentbpm = timinglist[0]

  useTick(() => {
    if (bgimage.height > 1) {
      const height = bgimage.height * (WIDTH / bgimage.width)
      bgimage.height = height
      bgimage.width = WIDTH
      // bgimage.blendMode = BLEND_MODES.ADD
      bgimage.x = WIDTH / 2
      bgimage.y = HEIGHT / 2
      bgimage.anchor.set(0.5, 0.5)
      bgimage.alpha = 0.2
    }
    if (props.game.isPlaying) {
      if (props.game.mode == 'play') {
        var currentTime = props.game.audio.currentTime * 1000
        currentbpm = timinglist.filter((e) => e.time <= currentTime)[0]
        props.game.currenttime = currentTime
      }
      var reversespeedlist = props.game.beatmap.speedChanges
      var currentspeed =
        reversespeedlist != undefined
          ? reversespeedlist
              .filter((a: NoteSpeedModifier) => {
                return a.startTime <= props.game.currenttime
              })
              .sort((a: NoteSpeedModifier, b: NoteSpeedModifier) => {
                return a.startTime - b.startTime
              })
              .reverse()[0]?.speed * HEIGHT
          : props.game.notespeed
      if (currentspeed >= 0) {
        props.game.notespeed = SCROLL_SPEED
        // props.game.notespeed = currentspeed
      }
      // console.log(Math.abs(props.game.currenttime- props.game.audio.currentTime*1000))
    }
  })

  useTick(() => {
    if (props.game.mode == 'play') setactive(1)
    if (misstime != -1) {
      rgb.blue = [
        easeOutCubic(
          props.game.currenttime,
          [misstime, misstime + 1000],
          [10, 2]
        ),
        0,
      ]
      rgb.red = [
        -easeOutCubic(
          props.game.currenttime,
          [misstime, misstime + 1000],
          [10, 2]
        ),
        0,
      ]
      blur.blurX = easeOutCubic(
        props.game.currenttime,
        [misstime, misstime + 1000],
        [1.5, 0]
      )
    }
  })

  return (
    <>
      <Container alpha={props.game.mode == 'play' ? 1 : 0}>
        <CursorNote
          x={0.5}
          beatmap={props.beatmap}
          key={-1}
          i={-1}
          type={'normal'}
          container={container}
          game={props.game}
        />
        {props.beatmap.cursor.map((hitObject, i) => (
          <CursorNote
            x={hitObject.x}
            beatmap={props.beatmap}
            key={i}
            i={i}
            container={container}
            type={hitObject.type}
            game={props.game}
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <Column
            i={i + 1}
            key={i}
            hitObjects={props.beatmap.hitObjects.filter(
              (hitObject) => hitObject.column == i + 1
            )}
            timingPoints={props.beatmap.timingPoints}
            game={props.game}
          />
        ))}
        {[
          ...Array(
            Math.round(
              ((props.game.beatmap.hitObjects[
                props.game.beatmap.hitObjects.length - 1
              ].startTime -
                currentbpm.time) /
                (60000 / currentbpm.bpm)) *
                4
            )
          ),
        ].map((_, i) => (
          <BPMLine
            key={i}
            time={currentbpm.time + i * (60000 / currentbpm.bpm) * 4}
            game={props.game}
          />
        ))}
        <Cursor game={props.game} cursors={props.beatmap.cursor}></Cursor>
        <Sprite
          width={WIDTH}
          anchor={[0, 0.5]}
          image={judgement}
          y={HEIGHT - JUDGEMENT_LINE_OFFSET_Y}
        />
        <Sprite
          image={judgement2}
          x={0}
          y={HEIGHT}
          width={interpolate(
            props.game.currenttime,
            [
              0,
              props.game.beatmap.hitObjects[
                props.game.beatmap.hitObjects.length - 1
              ].startTime,
            ],
            [0, WIDTH]
          )}
          alpha={1}
          anchor={[0, 1]}
        />
      </Container>
    </>
  )
}
