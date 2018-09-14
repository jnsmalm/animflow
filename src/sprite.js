import { game } from "./game"
import { task } from "./task"

export function sprite(name) {
  let sprite = new PIXI.Sprite(PIXI.loader.resources[name].texture)
  sprite.anchor.set(0.5)
  sprite.scale.set(game[name].skala)

  task(function* () {
    game.root.addChild(sprite)
  })
  return sprite
}