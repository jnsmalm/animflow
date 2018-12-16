import { game } from "./game"
import { run_threads } from "./thread"

export function time() {
  return _elapsed_time / 1000
}

let _last = 0
let _elapsed_time = 0

function animation(time: number) {
  _elapsed_time = time - _last
  _last = time

  run_threads()
  game.render()

  requestAnimationFrame(animation)
}

requestAnimationFrame(animation)