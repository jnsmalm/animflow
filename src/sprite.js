import { game } from "./game"
import { task } from "./task"

export function sprite(name, parent) {
  let sprite
  if (!name) {
    sprite = new PIXI.Sprite()
  } else {
    sprite = PIXI.Sprite.from(name)
  }
  sprite.anchor.set(0.5)

  task(function* () {
    if (!parent) {
      parent = game.root
    }
    parent.addChild(sprite)
  })
  return sprite
}