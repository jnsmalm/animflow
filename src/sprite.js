import { game } from "./game"
import { task } from "./task"

export function sprite(name) {
  let sprite
  if (!name) {
    sprite = new PIXI.Sprite()
  } else if (PIXI.loader.resources[name]) {
    sprite = new PIXI.Sprite(PIXI.loader.resources[name].texture)
  } else {
    sprite = new PIXI.Sprite.fromImage(name)
  }
  sprite.anchor.set(0.5)

  task(function* () {
    game.root.addChild(sprite)
  })
  return sprite
}