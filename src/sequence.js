import { thread } from "./thread"
import { task, have_task_manager, get_tasks } from "./task"

export function sequence(job) {
  let _repeat = 1
  let _completed = false
  let _cancel = false

  let _sequence = function* () {
    for (let i = 0; i < _repeat; i++) {
      let tasks = get_tasks(job)
      for (let task of tasks) {
        for (let step of task()) {
          if (_cancel) {
            _completed = true
            return
          }
          yield
        }
      }
      if (_repeat > 1) {
        yield
      }
    }
    _completed = true
  }

  if (have_task_manager()) {
    task(function* () {
      yield* _sequence()
    })
  } else {
    thread(function* () {
      yield* _sequence()
    })
  }

  return {
    cancel: function () {
      task(function* () {
        _cancel = true
      })
    },
    completed: function () {
      return _completed
    },
    repeat: function (times = Number.MAX_VALUE) {
      _repeat = times
      return this
    }
  }
}