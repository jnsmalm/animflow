import { task } from "./task"
import { time } from "./time"

export function wait(seconds = Number.MAX_VALUE) {
  let _cancel = false

  task(function* () {
    let elapsed_time = 0
    while (elapsed_time < seconds && !_cancel) {
      elapsed_time += time()
      yield
    }
  })

  return {
    cancel: () => {
      task(function* () {
        _cancel = true
      })
    }
  }
}