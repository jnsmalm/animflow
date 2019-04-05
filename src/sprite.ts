import { game } from "./game"
import { task } from "./task"

export function sprite(name: string, parent?: PIXI.Container) {
  let sprite: PIXI.Sprite
  if (!name) {
    sprite = new PIXI.Sprite()
  } else {
    sprite = PIXI.Sprite.from(name)
  }
  sprite.anchor.set(0.5)

  task(function* (): IterableIterator<void> {
    if (!parent) {
      parent = game.app.stage
    }
    parent.addChild(sprite)
  })
  return sprite
}