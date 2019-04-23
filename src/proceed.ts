import { task } from "./task"
import { process } from "./process"

export function proceed(job: () => void) {
  let _cancel = false
  let _process: { cancel: () => void, priority: (value: number) => void }
  let _priority = 0

  task(function* (): IterableIterator<void> {
    if (_cancel) {
      return
    }
    _process = process(function* () {
      let tasks = task.get_tasks(job)
      for (let task of tasks) {
        yield* task()
      }
    })
    _process.priority(_priority)
  })
  return {
    cancel: function () {
      if (_process) {
        _process.cancel()
      }
      _cancel = true
    },
    priority: function (value: number) {
      if (_process) {
        _process.priority(value)
      }
      _priority = value
      return this
    }
  }
}