import { task } from "../src/task"
import { repeat } from "../src/repeat"
import { wait } from "../src/wait"
import { time } from "../src/time"
import { sequence } from "../src/sequence";

test('repeat number of times', () => {
  let number = 0
  let runner = task.get_task_runner(() => {
    repeat(() => {
      task(function* (): IterableIterator<void> {
        number++
      })
    }).times(5)
  })
  while (!runner.completed()) {
    runner.next()
  }
  expect(number).toBe(5)
})

test('cancel without task runner', () => {
  let number = 0
  let rptr: { cancel: () => void } | undefined
  let runner = task.get_task_runner(() => {
    rptr = repeat(() => {
      task(function* (): IterableIterator<void> {
        number++
      })
    })
  })
  for (let i = 1; i < 100; i++) {
    runner.next()
    if (i === 10 && rptr) {
      rptr.cancel()
    }
  }
  expect(number).toBe(10)
})

test('cancel with task runner', () => {
  let number = 0
  let runner = task.get_task_runner(() => {
    let rptr = repeat(() => {
      task(function* (): IterableIterator<void> {
        number++
      })
    })
    sequence(() => {
      wait(10)
      rptr.cancel()
    })
  })
  time.elapsed(1)
  while (!runner.completed()) {
    runner.next()
  }
  expect(number).toBe(10)
})