import { process } from "./process"
import { task } from "./task"

export interface sequence {
  cancel: () => void
  completed: () => boolean
}

export function sequence(job: () => void): sequence {
  let _completed = false
  let _cancel = false

  let _sequence = function* () {
    let tasks = task.get_tasks(job)
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

  if (task.have_task_manager()) {
    task(function* () {
      yield* _sequence()
    })
  } else {
    process(function* () {
      yield* _sequence()
    })
  }

  return {
    cancel: function () {
      if (!task.have_task_manager()) {
        _cancel = true
        return
      }
      task(function* (): IterableIterator<void> {
        _cancel = true
      })
    },
    completed: function () {
      return _completed
    }
  }
}