import { wait } from "../src/wait"
import { task } from "../src/task"
import { time } from "../src/time"

test('wait for time', () => {
  let runner = task.get_task_runner(() => {
    wait(2)
  })
  runner.next()
  expect(runner.completed()).toBe(false)

  time.elapsed(1)

  runner.next()
  expect(runner.completed()).toBe(false)

  runner.next()
  expect(runner.completed()).toBe(true)
})

test('wait until cancel', () => {
  let waiting: { cancel: () => void } | undefined
  let runner = task.get_task_runner(() => {
    waiting = wait()
  })
  runner.next()
  expect(runner.completed()).toBe(false)

  if (waiting) {
    waiting.cancel()
  }
  runner.next()
  expect(runner.completed()).toBe(true)
})