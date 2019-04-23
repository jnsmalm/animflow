import { process } from "../src/process"

test('single process', () => {
  let number = 0
  process(function* (): IterableIterator<void> {
    number = 1
  })
  process.run_all()
  expect(number).toBe(1)
})

test('single process with yield', () => {
  let number = 0
  process(function* (): IterableIterator<void> {
    number = 1
    yield
    number = 2
  })
  process.run_all()
  expect(number).toBe(1)
  process.run_all()
  expect(number).toBe(2)
})

test('multiple processes', () => {
  let number = 0
  process(function* (): IterableIterator<void> {
    number++
  })
  process(function* (): IterableIterator<void> {
    number++
  })
  process.run_all()
  expect(number).toBe(2)
})

test('multiple processes with priority', () => {
  let number = 0
  process(function* (): IterableIterator<void> {
    number = 1
  }).priority(1)
  process(function* (): IterableIterator<void> {
    number = 3
  }).priority(3)
  process(function* (): IterableIterator<void> {
    number = 2
  }).priority(2)
  process.run_all()
  expect(number).toBe(3)
})

test('start process in other process', () => {
  let number = 0
  process(function* (): IterableIterator<void> {
    number = 1
    process(function* (): IterableIterator<void> {
      number = 2
    })
  })
  process.run_all()
  expect(number).toBe(2)
})

test('cancel', () => {
  let number = 0
  let t = process(function* (): IterableIterator<void> {
    number = 1
    yield
    number = 2
  })
  process.run_all()
  expect(number).toBe(1)
  t.cancel()
  process.run_all()
  expect(number).toBe(1)
})