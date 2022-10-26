import { Container, Text, useTick } from '@inlet/react-pixi'
import { BLEND_MODES, TextStyle } from 'pixi.js'
import { useState } from 'react'
import { HEIGHT, WIDTH } from '../../libs/options'
import { GameState } from '../../state/GameState'
import font from '../../assets/LEMONMILK-Bold.otf'

type Props = {
  game: GameState
}

export default function Display(props: Props) {
  const [combo, setCombo] = useState('0')

  useTick(() => {
    setCombo(props.game.combo.toString())
  })

  return (
    <Container>
      <Text
        text={combo + " streak"}
        x={WIDTH-20}
        y={15}
        blendMode={BLEND_MODES.ADD}
        anchor={[1, 0]}
        alpha={0.5}
        style={
          new TextStyle({
            fontFamily: 'Courier New',
            fontWeight:'bold',
            align: 'center',
            fill: '#ffffff',
            fontSize: 50,
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
            fontWeight:'bold',
            align: 'center',
            fill: '#ffffff',
            fontSize: 25,
          })
        }
      />
      <Text
        text={
          '( ' +
          Math.round(((props.game.score / props.game.maxscore) * 100)).toString() +
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
            fontWeight:'bold',
            align: 'center',
            fill: '#ffffff',
            fontSize: 20,
          })
        }
      />
    </Container>
  )
}
