import { GameState } from './GameState'

export async function hit(
  score: string,
  time: number,
  key: number,
  game: GameState
) {
  let valid = true
  game.hitlist.forEach((element) => {
    if (element.startsWith(time.toString() + key.toString()) && key < 6) {
      valid = false
    }
  })
  if (valid) {
    game.score += game.idtoscore(score)
    game.combo += 1
    game.hitlist.push(time.toString() + key.toString() + ',' + score)
    return true
  } else {
    return false
  }
}

export async function miss(time: number, key: number, game: GameState) {
  game.combo = 0
  game.hitlist.push(time.toString() + key.toString() + 'miss')
}
