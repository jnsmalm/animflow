import { task } from "../src/task"
import { parallel } from "../src/parallel";
import { process } from "../src/process";

test('parallel in task runner', () => {
  let number = 0
  let runner = task.get_task_runner(() => {
    parallel(() => {
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
  runner.next()
  expect(number).toBe(4)
})

test('parallel in thread', () => {
  let number = 0
  parallel(() => {
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
  process.run_all()
  expect(number).toBe(4)
})

test('cancel with task', () => {
  let number = 0
  let runner = task.get_task_runner(() => {
    let par = parallel(() => {
      task(function* (): IterableIterator<void> {
        number += 2
        yield
        number /= 2
      })
      par.cancel()
      task(function* (): IterableIterator<void> {
        number *= 4
      })
    })
  })
  while (!runner.completed()) {
    runner.next()
  }
  expect(number).toBe(2)
})

test('cancel without task', () => {
  let number = 0
  let par: parallel | undefined
  let runner = task.get_task_runner(() => {
    par = parallel(() => {
      task(function* (): IterableIterator<void> {
        number += 2
        yield
        number /= 2
      })
      task(function* (): IterableIterator<void> {
        number *= 4
      })
    })
  })
  runner.next()

  if (par) {
    par.cancel()
  }
  runner.next()
  expect(number).toBe(8)
})

test('completed', () => {
  let par: parallel | undefined
  let runner = task.get_task_runner(() => {
    par = parallel(() => {
      task(function* (): IterableIterator<void> {
        yield
      })
      task(function* (): IterableIterator<void> {
        return
      })
    })
  })
  if (par) {
    expect(par.completed()).toBe(false)

    runner.next()
    expect(par.completed()).toBe(false)

    runner.next()
    expect(par.completed()).toBe(true)
  }
})