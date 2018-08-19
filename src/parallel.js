import { thread } from "./thread"
import { task, have_task_manager, get_tasks } from "./task"

export function parallel(job) {
  let _repeat = 1
  let _completed = false
  let _cancel = false

  let _parallel = function* () {
    for (let i = 0; i < _repeat; i++) {
      let tasks = get_tasks(job)
      tasks.reverse()
      for (let i = 0; i < tasks.length; i++) {
        tasks[i] = tasks[i]()
      }
      while (tasks.length > 0) {
        for (let i = tasks.length - 1; i >= 0; i--) {
          if (_cancel) {
            _completed = true
            return
          }
          if (tasks[i].next().done) {
            tasks.splice(i, 1)
          }
        }
        yield
      }
    }
    _completed = true
  }

  if (have_task_manager()) {
    task(function* () {
      yield* _parallel()
    })
  } else {
    thread(function* () {
      yield* _parallel()
    })
  }

  return {
    cancel: () => {
      task(function* () {
        _cancel = true
      })
    },
    completed: () => {
      return _completed
    },
    repeat: (times = Number.MAX_VALUE) => {
      _repeat = times
      return this
    }
  }
}