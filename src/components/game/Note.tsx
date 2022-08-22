import React, { useState } from 'react'
import { Sprite, useTick } from '@inlet/react-pixi'
import { Texture } from 'pixi.js'

export default function Note(n: any) {
	return <Sprite texture={Texture.WHITE} x={400} y={n['n']} anchor={0.5} width={100} height={20}></Sprite>
}
