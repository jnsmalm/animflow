import { task } from "./task"
import { thread } from "./thread"

export function proceed(job: () => void) {
  let _cancel = false
  let _thread: { cancel: () => void, priority: (value: number) => void }
  let _priority = 0

  task(function* (): IterableIterator<void> {
    if (_cancel) {
      return
    }
    _thread = thread(function* () {
      let tasks = task.get_tasks(job)
      for (let task of tasks) {
        yield* task()
      }
    })
    _thread.priority(_priority)
  })
  return {
    cancel: function () {
      if (_thread) {
        _thread.cancel()
      }
      _cancel = true
    },
    priority: function (value: number) {
      if (_thread) {
        _thread.priority(value)
      }
      _priority = value
      return this
    }
  }
}