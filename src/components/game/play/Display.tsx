import { Container, Text, useApp, useTick, Sprite } from '@inlet/react-pixi'
import {
  BLEND_MODES,
  TextStyle,
  Text as PIXITEXT,
  Texture,
  Sprite as SPRITE,
  Container as CONTAINER,
  filters,
} from 'pixi.js'
import { useEffect, useState } from 'react'
import { CURSOR_AREA, HEIGHT, PLAYFIELD_WIDTH, WIDTH } from '../../../libs/options'
import { GameState } from '../../../state/GameState'
import combobox from '../../../assets/combobox.png'
import { easeOutCubic, interpolate } from '../../../libs/interpolate'
import perfect from '../../../assets/perfect.png'
import great from '../../../assets/great.png'
import ok from '../../../assets/ok.png'
import miss from '../../../assets/miss.png'
import scoreline from '../../../assets/scoreline.png'
import comboline from '../../../assets/comboline.png'
import overlay from '../../../assets/overlay.png'
import playarealine from '../../../assets/playarealine.png'
import scorebox from '../../../assets/scorebox.png'
type Props = {
  game: GameState
}
const sprites = {
  '': miss,
  perfect: perfect,
  great: great,
  ok: ok,
}

let clicktime = -1
const container = new CONTAINER()
const MAINFONT = 'Roboto Condensed'

export function triggereffect(time: number, score: string) {
  if (container.getChildByName('scoretext') == null) {
    container.addChild(text)
  } else {
    let text = container.getChildByName('scoretext')
  }
  clicktime = time
  let sscore = score.slice(1)
  sscore = score[0].toUpperCase() + sscore
  text.text = sscore
}
const middlescreenv = HEIGHT / 2
function generatetext(text: string) {
  return new PIXITEXT(
    text,
    new TextStyle({
      fill: 'white',
      dropShadow: true,
      dropShadowBlur: 5,
      dropShadowDistance: 0,
      dropShadowColor: 0xffffff,
      fontFamily: 'Courier New',
      fontSize: 30,
      fontWeight: '900',
      fontVariant: 'small-caps',
    })
  )
}
let text = generatetext('')
text.anchor.set(0.5, 0.5)
text.name = 'scoretext'
text.x = WIDTH / 2
text.y = HEIGHT / 2
text.blendMode = BLEND_MODES.ADD
text.alpha = 0

{
  /* <Text
        text={
          props.game.beatmap.metadata.artist +
          ' - ' +
          props.game.beatmap.metadata.title
        }
        x={0}
        y={80}
        width={500}
        alpha={0.2}
        tint={0xFF33D2}
        anchor={[0, 1]}
        blendMode={BLEND_MODES.ADD_NPM}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            fontWeight: "bold",
            align: 'center',
            fill: '#ffffff',
            fontSize: 50,
          })
        }
      /> */
}
export default function Display(props: Props) {
  const app = useApp()
  app.stage.addChild(container)
  const [combo, setCombo] = useState('0')
  const [active, setactive] = useState(0)
  const [fps, setfps] = useState('0')

  let title = generatetext(
    props.game.beatmap.metadata.artist +
      ' - ' +
      props.game.beatmap.metadata.title
  )
  if (
    container.getChildByName('scoretext') == null
  ) {
    title.x = 0
    title.y = 80
    title.width = 500
    title.name = 'title'
    title.alpha = 0
    title.tint = 0xff33d2
    title.anchor.set(0, 1)
    title.blendMode = BLEND_MODES.ADD_NPM
    title.style = new TextStyle({
      fontFamily: MAINFONT,
      fontWeight: 'bold',
      align: 'center',
      fill: '#ffffff',
      fontSize: 50,
    })
    container.addChild(title)
    container.addChild(text)
  } else {
    text = container.getChildByName('scoretext')
    title = container.getChildByName('title')
  }
  useEffect(() => {
    setInterval(() => {
      setfps(Math.round(app.ticker.FPS).toString())
    }, 1000)
  })

  useTick(() => {
    if (props.game.mode == 'play') {
      const currentTime = props.game.currenttime
      text.scale.x = text.scale.y = easeOutCubic(
        currentTime,
        [clicktime, clicktime + 100],
        [1.5, 1]
      )
      text.alpha = easeOutCubic(
        currentTime,
        [clicktime, clicktime + 500],
        [1, 0]
      )
      setCombo(props.game.combo.toString())
    }
  })
  useTick(() => {
    if (props.game.mode == 'play') setactive(1)
  })

  return (
    <Container alpha={active}>
      <Sprite
        texture={Texture.WHITE}
        x={0}
        y={100}
        alpha={1}
        width={WIDTH}
        height={4}
        anchor={[0, 0]}
      />
      <Sprite
        image={playarealine}
        x={WIDTH/2 - CURSOR_AREA/2}
        y={HEIGHT/2}
        anchor={[0.5, 0.5]}
        scale={HEIGHT*0.95/734}
        alpha={1}
      />
      <Sprite
        image={playarealine}
        x={WIDTH/2 + CURSOR_AREA/2}
        y={HEIGHT/2}
        anchor={[0.5, 0.5]}
        scale={HEIGHT*0.95/734}
        alpha={1} 
      />
      <Sprite
        image={overlay}
        x={0}
        y={0}
        alpha={1}
        width={WIDTH}
        anchor={[0, 0]}
      />
      <Text
        text={
          props.game.beatmap.metadata.artist +
          ' - ' +
          props.game.beatmap.metadata.title
        }
        x={WIDTH/2}
        y={80}
        anchor={[0.5, 1]}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            fontWeight: 'bold',
            align: 'center',
            fill: '#ffffff',
            fontSize: 36,
          })
        }
      />
      <Text
        text={'Charted by ' + props.game.beatmap.metadata.creator}
        x={WIDTH/2 - 20}
        y={40}
        anchor={[1, 1]}
        alpha={0.5}
        blendMode={BLEND_MODES.ADD}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            align: 'center',
            fontWeight: 'bold',
            fontStyle: 'italic',
            fill: '#ffffff',
            fontSize: 15,
          })
        }
      />
      <Text
        text={props.game.beatmap.metadata.difficult}
        x={WIDTH/2+20}
        y={40 }
        anchor={[0, 1]}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            align: 'center',
            fontWeight: 'bold',
            fontStyle: 'italic',
            fill: '#ffffff',
            fontSize: 15,
          })
        }
      />
      <Text
        text={'FPS : ' + fps}
        x={WIDTH - 30}
        y={116}
        blendMode={BLEND_MODES.ADD}
        anchor={[1, 0]}
        alpha={0.5}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            align: 'center',
            fill: '#ffffff',
            fontSize: 15,
          })
        }
      />
      <Text
        text={combo + ' COMBO'}
        x={WIDTH/2}
        y={115}
        anchor={[.5, 0]}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            align: 'left',
            fill: '#ffffff',
            fontSize: 15,
          })
        }
      />
      {/* <Text
        text={props.game.highestcombo + ' / ' + props.game.maxcombo}
        x={WIDTH/2}
        y={195}
        blendMode={BLEND_MODES.ADD}
        anchor={[.5, 0]}
        alpha={0.5}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            align: 'left',
            fill: '#ffffff',
            fontSize: 15,
          })
        }
      /> */}
      <Text
        text={Math.round(
          (props.game.score / props.game.maxscore) * 1000000
        ).toString()}
        x={WIDTH/2}
        y={132}
        alpha={1}
        anchor={[.5, 0]}
        blendMode={BLEND_MODES.ADD}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            fontWeight: 'bold',
            align: 'left',
            fill: '#ffffff',
            fontSize: 31,
          })
        }
      />
      {/* <Text
        text={
          '(' +
          Math.round(
            (props.game.score / props.game.maxscore) * 100
          ).toString() +
          '% MAX)'
        }
        x={WIDTH/2}
        y={120}
        blendMode={BLEND_MODES.ADD}
        alpha={0.5}
        anchor={[.5, 0]}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            fontWeight: 'bold',
            align: 'left',
            fill: '#ffffff',
            fontSize: 11,
          })
        }
      /> */}
    </Container>
  )
}
