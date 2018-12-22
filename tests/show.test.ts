import { show } from "../src/show"
import { task } from "../src/task"
import { time } from "../src/time"

test('show without time', () => {
  let object = { alpha: 0 }
  let runner = task.get_task_runner(() => {
    show(object)
  })
  runner.next()
  expect(object.alpha).toBe(1)
})

test('show with time', () => {
  let object = { alpha: 0 }
  let runner = task.get_task_runner(() => {
    show(object).time(1)
  })
  time.elapsed(0.5)

  runner.next()
  expect(object.alpha).toBe(0.5)

  runner.next()
  expect(object.alpha).toBe(1)
})