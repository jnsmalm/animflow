import { task } from "./task"

export function remove(object: PIXI.DisplayObject) {
  task(function* (): IterableIterator<void> {
    if (object.parent) {
      object.parent.removeChild(object)
    }
  })
}