type task = () => IterableIterator<void>

interface task_register {
  add: (task: task) => void
}

let _registers: task_register[] = []

export function task(task: task) {
  return _registers[_registers.length - 1].add(task)
}

task.get_tasks = (job: () => void) => {
  let tasks: task[] = []
  _registers.push({
    add: (task) => {
      tasks.push(task)
      return task
    }
  })
  job()
  _registers.pop()
  return tasks
}

task.get_task_runner = (job: () => void) => {
  let _completed = false
  let _tasks = task.get_tasks(job).map(value => value())
  return {
    next: () => {
      _completed = true
      for (let task of _tasks) {
        if (!task.next().done) {
          _completed = false
        }
      }
    },
    completed: () => {
      return _completed
    }
  }
}

task.have_task_manager = () => {
  return _registers.length > 0
}