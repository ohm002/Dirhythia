import { Container, Text, useApp, useTick } from '@inlet/react-pixi'
import {
  BLEND_MODES,
  TextStyle,
  Text as PIXITEXT,
  Texture,
  Sprite as SPRITE,
  filters,
} from 'pixi.js'
import { useState } from 'react'
import { HEIGHT, WIDTH } from '../../libs/options'
import { GameState } from '../../state/GameState'
import font from '../../assets/LEMONMILK-Bold.otf'
import { interpolate } from '../../libs/interpolate'
import perfect from '../../assets/perfect.png'
import great from '../../assets/great.png'
import ok from '../../assets/ok.png'
import miss from '../../assets/miss.png'

type Props = {
  game: GameState
}

const sprites = {
  '': miss,
  perfect: perfect,
  great: great,
  ok: ok,
}

// const text = SPRITE.from(miss
const text = new PIXITEXT(
  '',
  new TextStyle({
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    align: 'center',
    fill: '#ffffff',
    fontSize: 20,
  })
)
text.anchor.set(0.5)
text.name = 'scoretext'
const textblur = new PIXITEXT(
  '',
  new TextStyle({
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    align: 'center',
    fill: '#ffffff',
    fontSize: 20,
  })
)
textblur.anchor.set(0.5)
textblur.name = 'scoretext'
// text.texture = Texture.from(sprites[''])

let clicktime = -1

export function triggereffect(time: number, score: string) {
  clicktime = time
  text.text = score.toUpperCase()
}

export default function Display(props: Props) {
  const [combo, setCombo] = useState('0')
  const app = useApp()
  text.x = WIDTH / 2
  text.y = HEIGHT / 2
  text.alpha = 0
  textblur.filters = [new filters.BlurFilter(10)]
  app.stage.addChild(text)
  app.stage.addChild(textblur)

  useTick(() => {
    const currentTime = props.game.currenttime
    text.alpha = interpolate(currentTime, [clicktime, clicktime + 500], [1, 0])
    setCombo(props.game.combo.toString())
  })

  return (
    <Container>
      <Text
        text={combo}
        x={WIDTH - 20}
        y={15}
        blendMode={BLEND_MODES.ADD}
        anchor={[1, 0]}
        alpha={0.5}
        style={
          new TextStyle({
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            align: 'center',
            fill: '#ffffff',
            fontSize: 50,
          })
        }
      />
      <Text
        text={props.game.highestcombo + ' / ' + props.game.maxcombo}
        x={WIDTH - 20}
        y={60}
        blendMode={BLEND_MODES.ADD}
        anchor={[1, 0]}
        alpha={0.5}
        style={
          new TextStyle({
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            align: 'center',
            fill: '#ffffff',
            fontSize: 25,
          })
        }
      />
      <Text
        text={Math.round(
          (props.game.score / props.game.maxscore) * 1000000
        ).toString()}
        x={10}
        y={20}
        alpha={0.5}
        anchor={[0, 0.5]}
        blendMode={BLEND_MODES.ADD}
        style={
          new TextStyle({
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            align: 'center',
            fill: '#ffffff',
            fontSize: 25,
          })
        }
      />
      <Text
        text={
          '( ' +
          Math.round(
            (props.game.score / props.game.maxscore) * 100
          ).toString() +
          '% )'
        }
        x={10}
        y={45}
        blendMode={BLEND_MODES.ADD}
        alpha={0.5}
        anchor={[0, 0.5]}
        style={
          new TextStyle({
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            align: 'center',
            fill: '#ffffff',
            fontSize: 20,
          })
        }
      />
    </Container>
  )
}
