import { game } from "./game"
import { task } from "./task"

export function text(str: string, parent?: PIXI.Container) {
  let text = new PIXI.Text(str, {
    fontFamily: "Helvetica", fontSize: 36, fill: 0xffffff, align: "center"
  });
  text.anchor.set(0.5)

  task(function* (): IterableIterator<void> {
    if (!parent) {
      parent = game.stage()
    }
    parent.addChild(text)
  })
  return text
}