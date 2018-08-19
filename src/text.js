import { game } from "./game"
import { task } from "./task"

export function text(txt) {
  let text = new PIXI.Text(txt, {
    fontFamily: "Helvetica", fontSize: 36, fill: 0xffffff, align: "center"
  });
  text.anchor.set(0.5)

  task(function* () {
    game.root.addChild(text)
  })
  return text
}