import { task } from "../src/task"
import { sequence } from "../src/sequence";
import { thread } from "../src/thread";

test('sequence in task runner', () => {
  let number = 0
  let runner = task.get_task_runner(() => {
    sequence(() => {
      task(function* (): IterableIterator<void> {
        number = 2
        yield
      })
      task(function* (): IterableIterator<void> {
        number *= 4
        yield
      })
      task(function* (): IterableIterator<void> {
        number /= 2
        yield
      })
    })
  })
  while (!runner.completed()) {
    runner.next()
  }
  expect(number).toBe(4)
})

test('sequence in thread', () => {
  let number = 0
  sequence(() => {
    task(function* (): IterableIterator<void> {
      number = 2
      yield
    })
    task(function* (): IterableIterator<void> {
      number *= 4
      yield
    })
    task(function* (): IterableIterator<void> {
      number /= 2
      yield
    })
  })
  for (let i = 0; i < 3; i++) {
    thread.run_all()
  }
  expect(number).toBe(4)
})

test('cancel with task', () => {
  let number = 0
  let runner = task.get_task_runner(() => {
    let seq = sequence(() => {
      task(function* (): IterableIterator<void> {
        number = 1
        yield
      })
      seq.cancel()
      task(function* (): IterableIterator<void> {
        number = 2
      })
    })
  })
  while (!runner.completed()) {
    runner.next()
  }
  expect(number).toBe(1)
})

test('cancel without task', () => {
  let number = 0
  let seq: sequence | undefined
  let runner = task.get_task_runner(() => {
    seq = sequence(() => {
      task(function* (): IterableIterator<void> {
        number = 1
        yield
      })
      task(function* (): IterableIterator<void> {
        number = 2
      })
    })
  })
  runner.next()

  if (seq) {
    seq.cancel()
  }
  runner.next()
  expect(number).toBe(1)
})

test('completed', () => {
  let seq: sequence | undefined
  let runner = task.get_task_runner(() => {
    seq = sequence(() => {
      task(function* (): IterableIterator<void> {
        yield
      })
      task(function* (): IterableIterator<void> {
        return
      })
    })
  })
  if (seq) {
    expect(seq.completed()).toBe(false)

    runner.next()
    expect(seq.completed()).toBe(false)

    runner.next()
    expect(seq.completed()).toBe(true)
  }
})