import { thread } from "./thread"
import { task, have_task_manager, get_tasks } from "./task"

export function sequence(job: () => void) {
  let _completed = false
  let _cancel = false

  let _sequence = function* () {
    let tasks = get_tasks(job)
    for (let task of tasks) {
      if (_cancel) {
        _completed = true
        return
      }
      for (let step of task()) {
        if (_cancel) {
          _completed = true
          return
        }
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
      task(function* (): IterableIterator<void> {
        _cancel = true
      })
    },
    completed: function () {
      return _completed
    }
  }
}