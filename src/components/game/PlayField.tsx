import { useEffect } from 'react'
import { Container, Sprite, useApp, useTick } from '@inlet/react-pixi'
import { Beatmap } from '../../types/Beatmap'
import { TimingPoint } from '../../types/TimingPoint'
import {
  BLEND_MODES,
  filters,
  Texture,
  Text,
  TextStyle,
  Sprite as SPRITE,
  TextureLoader,
  Loader,
  Container as container,
} from 'pixi.js'
import Column from './Column'
import {
  WIDTH,
  JUDGEMENT_LINE_OFFSET_Y,
  HEIGHT,
  PLAYFIELD_WIDTH,
  NOTE_TRAVEL_DURATION,
} from '../../libs/options'
import { GameState } from '../../state/GameState'
import Cursor from './Cursor'
import CursorNote, { BPMLine } from './CursorNote'
import React from 'react'
import judgement from '../../assets/judgement.png'
import judgement2 from '../../assets/judgement2.png'
import bg from '../../data/void(Mournfinale) - World Vanquisher/87729274_p0.jpg'
import { interpolate } from '../../libs/interpolate'

type PlayFieldProps = {
  beatmap: Beatmap
  game: GameState
}

export default function PlayField(props: PlayFieldProps) {
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
  const timinglist = props.game.beatmap.timingPoints.sort(
    (a, b) => a.time - b.time
  )
  let currentbpm = timinglist[0]
  // setInterval(() => {
  //   GAME.hitwaitlist.forEach((element) => {
  //     GAME.score += GAME.idtoscore(element.split(',')[1])
  //     GAME.combo += 1
  //     if (GAME.combo > GAME.highestcombo) GAME.highestcombo = GAME.combo
  //     GAME.hitlist.push(element)
  //     GAME.hitwaitlist = GAME.hitwaitlist.filter((item) => item !== element)
  //   })
  // }, 1000)
  useTick(() => {
    if (props.game.isPlaying) {
      var currentTime = Date.now() - props.game.playStartTime
      currentbpm = timinglist.filter((e) => e.time <= currentTime)[0]
      props.game.currenttime = currentTime
      // console.log(Math.abs(props.game.currenttime- props.game.audio.currentTime*1000))
    }
  })
  const app = useApp()
  const bgimage = SPRITE.from(bg)
  app.stage.addChild(bgimage)
  // const ratio = bgimage.width * WIDTH
  bgimage.width = WIDTH
  bgimage.height = HEIGHT
  bgimage.blendMode = BLEND_MODES.ADD
  bgimage.x = WIDTH / 2
  bgimage.y = HEIGHT / 2
  bgimage.anchor.set(0.5, 0.5)
  bgimage.alpha = 0.2
  return (
    <>
      <Container>
        <CursorNote
          x={0.5}
          beatmap={props.beatmap}
          key={-1}
          i={-1}
          type={'normal'}
          game={props.game}
        />
        {props.beatmap.cursor.map((hitObject, i) => (
          <CursorNote
            x={hitObject.x}
            beatmap={props.beatmap}
            key={i}
            i={i}
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
      </Container>
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
        width={interpolate(props.game.currenttime,[0, props.game.beatmap.hitObjects[props.game.beatmap.hitObjects.length-1].startTime],[0,WIDTH])}
        alpha={1}
        anchor={[0, 1]}
      />
    </>
  )
}
