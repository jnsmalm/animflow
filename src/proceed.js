import { task, get_tasks } from "./task"
import { thread } from "./thread"

export function proceed(job) {
  let _cancel = false
  let _thread
  let _priority = 0

  task(function* () {
    if (_cancel) {
      return
    }
    _thread = thread(function* () {
      let tasks = get_tasks(job)
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
    priority: function (value) {
      if (_thread) {
        _thread.priority(value)
      }
      _priority = value
      return this
    }
  }
}