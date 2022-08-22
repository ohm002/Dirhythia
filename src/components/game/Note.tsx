import { useState } from 'react'
import { Sprite, useTick } from '@inlet/react-pixi'
import { Texture } from 'pixi.js'

type NoteProps = {
  x: number
}

export default function Note(props: NoteProps) {
  const [y, setY] = useState(0)

  useTick((d)=>{

  })

  return (
    <Sprite
      texture={Texture.WHITE}
      x={props.x}
      y={y}
      anchor={0.5}
      width={100}
      height={20}
    ></Sprite>
  )
}
