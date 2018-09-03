import { task, get_tasks } from "./task"
import { thread } from "./thread"

export function proceed(job) {
  let _thread, _priority = 0

  task(function* () {
    _thread = thread(function* () {
      let tasks = get_tasks(job)
      for (let task of tasks) {
        yield* task()
      }
    })
    _thread.priority(_priority)
  })
  return {
    priority: function (value) {
      if (_thread) {
        _thread.priority(value)
      }
      _priority = value
    }
  }
}