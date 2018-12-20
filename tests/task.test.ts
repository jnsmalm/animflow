import { task } from "../src/task"

test('get single task', () => {
  let number = 0
  let tasks = task.get_tasks(() => {
    task(function* (): IterableIterator<void> {
      number = 1
    })
  })
  for (let task of tasks) {
    for (let _ of task()) { }
  }
  expect(number).toBe(1)
})

test('get multiple tasks', () => {
  let number = 0
  let tasks = task.get_tasks(() => {
    task(function* (): IterableIterator<void> {
      number++
    })
    task(function* (): IterableIterator<void> {
      number++
    })
    task(function* (): IterableIterator<void> {
      number++
    })
  })
  for (let task of tasks) {
    for (let _ of task()) { }
  }
  expect(number).toBe(3)
})

test('get tasks hierarchy', () => {
  let number = 2
  let tasks = task.get_tasks(() => {
    let tasks = task.get_tasks(() => {
      task(function* (): IterableIterator<void> {
        number = 4
      })
    })
    task(function* (): IterableIterator<void> {
      number *= 2
    })
  })
  for (let task of tasks) {
    for (let _ of task()) { }
  }
  expect(number).toBe(4)
})

test('have task manager', () => {
  expect(task.have_task_manager()).toBe(false)
  task.get_tasks(() => {
    expect(task.have_task_manager()).toBe(true)
  })
})