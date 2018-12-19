import { thread } from "./thread"
import { task } from "./task"

export function parallel(job) {
  let _completed = false
  let _cancel = false

  let _parallel = function* () {
    let tasks = task.get_tasks(job)
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
    _completed = true
  }

  if (task.have_task_manager()) {
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
    }
  }
}