import { task } from "./task"
import { time } from "./time"

export function wait(seconds = Number.MAX_VALUE) {
  let _cancel = false

  task(function* (): IterableIterator<void> {
    let elapsed_time = 0
    while (!_cancel) {
      elapsed_time += time.elapsed()
      if (elapsed_time >= seconds) {
        return
      }
      yield
    }
  })

  return {
    cancel: () => {
      if (task.have_task_manager()) {
        task(function* (): IterableIterator<void> {
          _cancel = true
        })
      } else {
        _cancel = true
      }
    }
  }
}