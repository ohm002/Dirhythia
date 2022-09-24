import { Container, Text, useTick } from '@inlet/react-pixi'
import { TextStyle } from 'pixi.js'
import { useState } from 'react'
import { HEIGHT, WIDTH } from '../../libs/options'
import { GameState } from '../../state/GameState'

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
        text={combo}
        x={WIDTH / 2}
        y={HEIGHT / 2}
        anchor={[0.5, 0.5]}
        alpha={0.5}
        style={
          new TextStyle({
            fontFamily: 'LEMONMILK',
            align: 'center',
            fill: '#ffffff',
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
        style={
          new TextStyle({
            fontFamily: 'LEMONMILK',
            align: 'center',
            fill: '#ffffff',
            fontSize: 20,
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
        alpha={0.5}
        anchor={[0, 0.5]}
        style={
          new TextStyle({
            fontFamily: 'LEMONMILK',
            align: 'center',
            fill: '#ffffff',
            fontSize: 15,
          })
        }
      />
    </Container>
  )
}
