import { process } from "./process"
import { task } from "./task"

export interface parallel {
  cancel: () => void
  completed: () => boolean
}

export function parallel(job: () => void): parallel {
  let _completed = false
  let _cancel = false

  let _parallel = function* () {
    let tasks = task.get_tasks(job).reverse().map((value) => {
      return value()
    })
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
      if (tasks.length === 0) {
        break
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
    process(function* () {
      yield* _parallel()
    })
  }

  return {
    cancel: () => {
      if (!task.have_task_manager()) {
        _cancel = true
        return
      }
      task(function* (): IterableIterator<void> {
        _cancel = true
      })
    },
    completed: () => {
      return _completed
    }
  }
}