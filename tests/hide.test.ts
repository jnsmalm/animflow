import { hide } from "../src/hide"
import { task } from "../src/task"
import { time } from "../src/time"

test('hide without time', () => {
  let object = { alpha: 1 }
  let runner = task.get_task_runner(() => {
    hide(object)
  })
  runner.next()
  expect(object.alpha).toBe(0)
})

test('hide with time', () => {
  let object = { alpha: 1 }
  let runner = task.get_task_runner(() => {
    hide(object).time(1)
  })
  time.elapsed(0.5)

  runner.next()
  expect(object.alpha).toBe(0.5)

  runner.next()
  expect(object.alpha).toBe(0)
})