let _handlers = []

export function task(job) {
  return _handlers[_handlers.length - 1].add(job)
}

export function get_tasks(job) {
  let tasks = []
  _handlers.push({
    add: (task) => {
      tasks.push(task)
      return task
    }
  })
  job()
  _handlers.pop()
  return tasks
}

export function have_task_manager() {
  return _handlers.length > 0
}