import { task } from "./task"

export function repeat(job: () => void) {
  let _completed = false
  let _times = Number.MAX_VALUE
  let _cancel = false

  task(function* () {
    for (let i = 0; i < _times; i++) {
      if (_cancel) {
        _completed = true
        return
      }
      let tasks = task.get_tasks(job)
      for (let task of tasks) {
        yield* task()
      }
      yield
    }
    _completed = true
  })

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
    },
    times: function (value: number) {
      _times = value
      return this
    }
  }
}