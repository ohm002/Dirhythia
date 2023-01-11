import { Sprite, TextStyle, Texture, Text } from "pixi.js"
import { GameState } from "../../state/GameState"

export function generateText(
  textstring: string,
  x: number,
  y: number,
  anchor: number[],
  interactive?: boolean,
  ) {
  const text = new Text()
  text.text = textstring
  if (interactive) text.interactive = interactive
  text.name = 'playbutton'
  text.x = x
  text.y = y
  text.anchor.set(anchor[0], anchor[1])
  text.style = new TextStyle({
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
  return text
}


export function generatesquare(
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  anchor: number[],
  color: number,
  game: GameState,
  custom?: string,
  interactive?: boolean,
) {
  const sq = Sprite.from(
    custom != '' && custom != undefined ? custom : Texture.WHITE
  )
  sq.name = name
  sq.x = x
  sq.y = y
  sq.tint = custom != '' && custom != undefined ? color : 0xffffff
  sq.width = width
  sq.height = height
  if (interactive) sq.interactive = interactive
  sq.anchor.set(anchor[0], anchor[1])
  sq.on('mousedown', () => {
    game.mousedown = name
  })
  return sq
}
