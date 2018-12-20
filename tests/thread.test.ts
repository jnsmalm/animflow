import { thread } from "../src/thread"

test('single thread', () => {
  let number = 0
  thread(function* (): IterableIterator<void> {
    number = 1
  })
  thread.run_all()
  expect(number).toBe(1)
})

test('single thread with yield', () => {
  let number = 0
  thread(function* (): IterableIterator<void> {
    number = 1
    yield
    number = 2
  })
  thread.run_all()
  expect(number).toBe(1)
  thread.run_all()
  expect(number).toBe(2)
})

test('multiple threads', () => {
  let number = 0
  thread(function* (): IterableIterator<void> {
    number++
  })
  thread(function* (): IterableIterator<void> {
    number++
  })
  thread.run_all()
  expect(number).toBe(2)
})

test('multiple threads with priority', () => {
  let number = 0
  thread(function* (): IterableIterator<void> {
    number = 1
  }).priority(1)
  thread(function* (): IterableIterator<void> {
    number = 3
  }).priority(3)
  thread(function* (): IterableIterator<void> {
    number = 2
  }).priority(2)
  thread.run_all()
  expect(number).toBe(3)
})

test('start thread in other thread', () => {
  let number = 0
  thread(function* (): IterableIterator<void> {
    number = 1
    thread(function* (): IterableIterator<void> {
      number = 2
    })
  })
  thread.run_all()
  expect(number).toBe(2)
})

test('cancel', () => {
  let number = 0
  let t = thread(function* (): IterableIterator<void> {
    number = 1
    yield
    number = 2
  })
  thread.run_all()
  expect(number).toBe(1)
  t.cancel()
  thread.run_all()
  expect(number).toBe(1)
})