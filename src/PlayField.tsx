import { Sprite, useTick } from '@inlet/react-pixi'
import React, { useState } from 'react'
import Note from './components/game/Note'
import { Texture } from 'pixi.js'

let n = 0
const started = Date.now()
export default function PlayField() {
	let [x, setX] = useState(-20)
	function update() {
		useTick((d) => {
			let rightnow = Date.now()
			setX(((rightnow - started - 0) / (1000 - 0)) * 520)
			n += 1
		})
	}
	update()
	return <Note n={x} />
}
