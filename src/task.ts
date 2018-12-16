type task = () => IterableIterator<void>

interface task_register {
  add: (task: task) => void
}

let _registers: task_register[] = []

export function task(task: task) {
  return _registers[_registers.length - 1].add(task)
}

export function get_tasks(job: () => void) {
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

export function have_task_manager() {
  return _registers.length > 0
}