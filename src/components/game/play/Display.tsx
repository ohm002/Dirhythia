import { Container, Text, useApp, useTick, Sprite } from '@inlet/react-pixi'
import {
  BLEND_MODES,
  TextStyle,
  Text as PIXITEXT,
  Texture,
  Sprite as SPRITE,
  Container as CONTAINER,
  filters,
  AnimatedSprite,
} from 'pixi.js'
import { useEffect, useState } from 'react'
import { HEIGHT, PLAYFIELD_WIDTH, WIDTH } from '../../../libs/options'
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
import scorebox from '../../../assets/scorebox.png'
type Props = {
  game: GameState
  container: CONTAINER
}
const sprites = {
  '': miss,
  perfect: perfect,
  great: great,
  ok: ok,
}

let clicktime = -1
const container = new CONTAINER()
const MAINFONT = "Roboto Condensed"

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
let text = new PIXITEXT(
  '',
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
text.anchor.set(0.5, 0.5)
text.name = 'scoretext'
text.x = WIDTH / 2
text.y = HEIGHT / 2
text.blendMode = BLEND_MODES.ADD
text.alpha = 0
export default function Display(props: Props) {
  const app = useApp()
  app.stage.addChild(container)
  const [combo, setCombo] = useState('0')
  const [active, setactive] = useState(0)
  const [fps, setfps] = useState('0')
  if (container.getChildByName('scoretext') == null) {
    container.addChild(text)
  } else {
    text = container.getChildByName('scoretext')
  }
  useEffect(() => {
    setInterval(() => {
      setfps(Math.round(app.ticker.FPS).toString())
    }, 1000)
  })

  useTick(() => {
    const currentTime = props.game.currenttime
    text.scale.x = text.scale.y = easeOutCubic(
      currentTime,
      [clicktime, clicktime + 100],
      [1.5, 1]
    )
    text.alpha = easeOutCubic(currentTime, [clicktime, clicktime + 500], [1, 0])
    setCombo(props.game.combo.toString())
  })
  useTick(() => {
    if (props.game.mode == 'play') setactive(1)
  })

  return (
    <Container alpha={active}>
      <Sprite
        image={overlay}
        x={0}
        y={0}
        alpha={1}
        width={WIDTH}
        anchor={[0, 0]}
      />
      <Sprite image={scorebox} x={29} y={23} alpha={1} anchor={[0, 0]} />
      <Sprite
        image={combobox}
        x={WIDTH - 20}
        y={20}
        alpha={1}
        anchor={[1, 0]}
      />
      <Sprite image={scoreline} x={378} y={81} alpha={1} anchor={[1, 0]} />
      <Sprite image={comboline} x={WIDTH - 30} y={78} anchor={[1, 0]} />

      <Text
        text={
          props.game.beatmap.metadata.artist +
          ' - ' +
          props.game.beatmap.metadata.title
        }
        x={WIDTH / 2}
        y={93}
        anchor={[0.5, 0]}
        blendMode={BLEND_MODES.ADD}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            align: 'center',
            fill: '#ffffff',
            fontSize: 20,
          })
        }
      />
      <Text
        text={'Charted by ' + props.game.beatmap.metadata.creator}
        x={WIDTH / 2}
        y={43}
        alpha={0.5}
        anchor={[0.5, 0]}
        blendMode={BLEND_MODES.ADD}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            align: 'center',
            fill: '#ffffff',
            fontSize: 10,
          })
        }
      />
      <Text
        text={props.game.beatmap.metadata.difficult}
        x={WIDTH / 2}
        y={66}
        anchor={[0.5, 0]}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            align: 'center',
            fill: '#ffffff',
            fontSize: 17,
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
        x={WIDTH - 30}
        y={59}
        anchor={[1, 0]}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            align: 'right',
            fill: '#ffffff',
            fontSize: 30,
          })
        }
      />
      <Text
        text={props.game.highestcombo + ' / ' + props.game.maxcombo}
        x={WIDTH - 30}
        y={40}
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
        text={Math.round(
          (props.game.score / props.game.maxscore) * 1000000
        ).toString()}
        x={156}
        y={54}
        alpha={1}
        anchor={[0, 0]}
        blendMode={BLEND_MODES.ADD}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            align: 'center',
            fill: '#ffffff',
            fontSize: 31,
          })
        }
      />
      <Text
        text={
          '(' +
          Math.round(
            (props.game.score / props.game.maxscore) * 100
          ).toString() +
          '% MAX)'
        }
        x={54}
        y={72}
        blendMode={BLEND_MODES.ADD}
        alpha={0.5}
        anchor={[0, 0]}
        style={
          new TextStyle({
            fontFamily: MAINFONT,
            align: 'center',
            fill: '#ffffff',
            fontSize: 11,
          })
        }
      />
    </Container>
  )
}
