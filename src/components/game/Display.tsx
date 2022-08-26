import { Text, useTick } from '@inlet/react-pixi'
import { TextStyle } from 'pixi.js'
import { useState } from 'react'
import { HEIGHT, WIDTH } from '../../libs/options'
import { GameState } from '../../state/GameState'

type Props = {
  game: GameState
}

export default function Display(props:Props) {
  const [combo, setCombo] = useState('0')
  
  useTick(() => {
    setCombo(props.game.combo.toString())
  })

  return (
    <Text
      text={combo}
      x={WIDTH / 2}
      y={HEIGHT / 2}
      alpha={0.5}
      style={
        new TextStyle({
          fontFamily: "LEMONMILK" ,
          align: 'center',
          fill: '#ffffff'
        })
      }
    ></Text>
  )
}
