import { game } from "./game"
import { run_threads } from "./thread"

export function time() {
  return _elapsed_time / 1000
}

let _last = 0
let _elapsed_time = 0

function animation(timestamp) {
  _elapsed_time = timestamp - _last
  _last = timestamp

  run_threads()
  game.render()

  requestAnimationFrame(animation)
}

requestAnimationFrame(animation)