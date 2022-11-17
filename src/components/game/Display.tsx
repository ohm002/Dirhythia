import { Container, Text, useApp, useTick, Sprite } from '@inlet/react-pixi'
import {
  BLEND_MODES,
  TextStyle,
  Text as PIXITEXT,
  Texture,
  Sprite as SPRITE,
  filters,
  AnimatedSprite,
} from 'pixi.js'
import { useState } from 'react'
import { HEIGHT, PLAYFIELD_WIDTH, WIDTH } from '../../libs/options'
import { GameState } from '../../state/GameState'
import font from '../../assets/LEMONMILK-Bold.otf'
import { easeOutCubic, interpolate } from '../../libs/interpolate'
import perfect from '../../assets/perfect.png'
import great from '../../assets/great.png'
import ok from '../../assets/ok.png'
import miss from '../../assets/miss.png'
import scoreline from '../../assets/scoreline.png'
import comboline from '../../assets/comboline.png'
import judgement2 from '../../assets/judgement2.png'
import { getWidth, getHeight } from '../../libs/screenhandler'
type Props = {
  game: GameState
}
const sprites = {
  '': miss,
  perfect: perfect,
  great: great,
  ok: ok,
}
const text = new PIXITEXT(
  '',
  new TextStyle({
    fill: 'white',
    dropShadow: true,
    dropShadowBlur: 2,
    dropShadowColor: 'black',
    dropShadowDistance: 0,
    fontFamily: 'Courier New',
    fontSize: 30,
    fontWeight: '900',
    fontVariant: 'small-caps',
  })
)
text.anchor.set(0.5, 0.5)
text.name = 'scoretext'

let clicktime = -1

export function triggereffect(time: number, score: string) {
  clicktime = time
  let sscore = score.slice(1)
  sscore = score[0].toUpperCase() + sscore
  text.text = sscore
}
const middlescreenv = HEIGHT / 2
text.x = WIDTH / 2
text.y = HEIGHT / 2
text.alpha = 0
export default function Display(props: Props) {
  const [combo, setCombo] = useState('0')
  const app = useApp()
  app.stage.addChild(text)

  useTick(() => {
    const currentTime = props.game.currenttime
    text.scale.x = text.scale.y = easeOutCubic(
      currentTime,
      [clicktime, clicktime + 100],
      [1.5, 1]
    )
    text.alpha = interpolate(currentTime, [clicktime, clicktime + 500], [1, 0])
    setCombo(props.game.combo.toString())
  })

  return (
    <Container>
      <Sprite
        // image={topoverlay}
        texture={Texture.WHITE}
        tint={0x000000}
        x={0}
        width={330}
        height={130}
        y={0}
        alpha={1}
        anchor={[0, 0]}
      />
      <Sprite
        // image={topoverlay}
        texture={Texture.WHITE}
        tint={0x000000}
        x={WIDTH}
        width={200}
        height={130}
        y={0}
        alpha={1}
        anchor={[1, 0]}
      />
      <Sprite image={scoreline} x={0} y={15} alpha={0.5} anchor={[0, 0]} />
      <Sprite
        image={comboline}
        x={WIDTH - 30}
        y={5}
        alpha={0.5}
        anchor={[1, 0]}
      />

      <Text
        text={
          props.game.beatmap.metadata.artist +
          ' - ' +
          props.game.beatmap.metadata.title +
          ' by ' +
          props.game.beatmap.metadata.creator
        }
        x={10}
        y={70}
        width={300}
        height={30}
        blendMode={BLEND_MODES.ADD}
        anchor={[0, 0]}
        alpha={0.5}
        style={
          new TextStyle({
            fontFamily: 'Courier New',
            align: 'center',
            fontWeight: '900',
            fill: '#ffffff',
            fontSize: 36,
          })
        }
      />
      <Text
        text={props.game.beatmap.metadata.difficult}
        x={10}
        y={100}
        blendMode={BLEND_MODES.ADD}
        anchor={[0, 0]}
        alpha={0.5}
        height={20}
        style={ 
          new TextStyle({
            fontFamily: 'Courier New',
            align: 'center',
            fill: '#ffffff',
            fontSize: 18,
          })
        }
      />
      <Text
        text={'FPS : ' + Math.round(useApp().ticker.FPS).toString()}
        x={WIDTH - 20}
        y={100}
        blendMode={BLEND_MODES.ADD}
        anchor={[1, 0]}
        alpha={0.5}
        style={
          new TextStyle({
            fontFamily: 'Courier New',
            align: 'center',
            fill: '#ffffff',
            fontSize: 20,
            fontVariant: 'small-caps',
          })
        }
      />
      <Text
        text={combo + ' Combo'}
        x={WIDTH - 20}
        y={10}
        width={150}
        blendMode={BLEND_MODES.ADD}
        anchor={[1, 0]}
        alpha={1}
        style={
          new TextStyle({
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            align: 'center',
            fill: '#ffffff',
            fontVariant: 'small-caps',
            fontSize: 40,
          })
        }
      />
      <Text
        text={props.game.highestcombo + ' / ' + props.game.maxcombo}
        x={WIDTH - 20}
        y={50}
        blendMode={BLEND_MODES.ADD}
        anchor={[1, 0]}
        alpha={0.5}
        style={
          new TextStyle({
            fontFamily: 'Courier New',
            // fontWeight: 'bold',
            align: 'center',
            fill: '#ffffff',
            fontSize: 20,
            fontVariant: 'small-caps',
          })
        }
      />
      <Text
        text={Math.round(
          (props.game.score / props.game.maxscore) * 1000000
        ).toString()}
        x={16}
        y={17}
        alpha={1}
        anchor={[0, 0.5]}
        blendMode={BLEND_MODES.ADD}
        style={
          new TextStyle({
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            align: 'center',
            fill: '#ffffff',
            fontSize: 25,
            fontVariant: 'small-caps',
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
        x={15}
        y={50}
        blendMode={BLEND_MODES.ADD}
        alpha={0.5}
        anchor={[0, 0.5]}
        style={
          new TextStyle({
            fontFamily: 'Courier New',
            align: 'center',
            fill: '#ffffff',
            fontSize: 15,
            fontVariant: 'small-caps',
          })
        }
      />
    </Container>
  )
}
