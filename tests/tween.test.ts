import { task } from "../src/task"
import { tween } from "../src/tween"
import { time } from "../src/time"

test('tween without time', () => {
  let object = { x: 0, y: 0 }
  let tasks = task.get_tasks(() => {
    tween(object).to({ x: 1, y: 2 })
  })
  for (let task of tasks) {
    for (let _ of task()) { }
  }
  expect(object.x).toBe(1)
  expect(object.y).toBe(2)
})

test('tween with time', () => {
  let object = { x: 0, y: 0 }
  
  let iterator = task.get_tasks(() => {
    tween(object).to({ x: 1, y: 2 }).time(1)
  }).map(value => value())[0]

  time.elapsed(0.5)

  iterator.next()
  expect(object.x).toBe(0.5)
  expect(object.y).toBe(1)

  iterator.next()
  expect(object.x).toBe(1)
  expect(object.y).toBe(2)
})