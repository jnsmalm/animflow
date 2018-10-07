const { thread, run_threads } = require('../src/thread')

test('single thread', () => {
  let number = 0
  thread(function* () {
    number = 1
  })
  run_threads()
  expect(number).toBe(1)
})

test('single thread with yield', () => {
  let number = 0
  thread(function* () {
    number = 1
    yield
    number = 2
  })
  run_threads()
  expect(number).toBe(1)
  run_threads()
  expect(number).toBe(2)
})

test('multiple threads', () => {
  let number = 0
  thread(function* () {
    number++
  })
  thread(function* () {
    number++
  })
  run_threads()
  expect(number).toBe(2)
})

test('multiple threads with priority', () => {
  let number = 0
  thread(function* () {
    number = 1
  }).priority(1)
  thread(function* () {
    number = 3
  }).priority(3)
  thread(function* () {
    number = 2
  }).priority(2)
  run_threads()
  expect(number).toBe(3)
})

test('start thread in other thread', () => {
  let number = 0
  thread(function* () {
    number = 1
    thread(function* () {
      number = 2
    })
  })
  run_threads()
  expect(number).toBe(2)
})

test('cancel', () => {
  let number = 0
  let t = thread(function* () {
    number = 1
  }).cancel()
  run_threads()
  expect(number).toBe(0)
})