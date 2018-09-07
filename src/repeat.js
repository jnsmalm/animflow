import { task, get_tasks } from "./task"

export function repeat(job) {
  let _times = Number.MAX_VALUE
  let _completed = false
  let _cancel = false

  task(function* () {
    for (let i = 0; i < _times; i++) {
      if (_cancel) {
        _completed = true
        return
      }
      let tasks = get_tasks(job)
      for (let task of tasks) {
        yield* task()
      }
      yield
    }
    _completed = true
  })

  return {
    cancel: function () {
      task(function* () {
        _cancel = true
      })
    },
    stop: function () {
      task(function* () {
        _stop = true
      })
    },
    completed: function () {
      return _completed
    },
    times: function (value) {
      _times = value
    }
  }
}