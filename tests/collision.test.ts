import { collision } from "../src/collision"
import { task } from "../src/task"

test('colliding aabb to aabb', () => {
  let aabb_collision = collision()
  let a = jest.fn()
  let b = jest.fn()

  let runner = task.get_task_runner(() => {
    aabb_collision.aabb().size(5, 5).handle(a)
    aabb_collision.aabb().size(5, 5).handle(b)
    aabb_collision.detect()
  })
  runner.next()

  expect(a.mock.calls.length).toBe(1)
  expect(b.mock.calls.length).toBe(1)
})

test('colliding sphere to sphere', () => {
  let sphere_collision = collision()
  let a = jest.fn()
  let b = jest.fn()

  let runner = task.get_task_runner(() => {
    sphere_collision.sphere().radius(5).handle(a)
    sphere_collision.sphere().radius(5).handle(b)
    sphere_collision.detect()
  })
  runner.next()

  expect(a.mock.calls.length).toBe(1)
  expect(b.mock.calls.length).toBe(1)
})

test('colliders in the same group', () => {
  let group_collision = collision()
  let a = jest.fn()

  let runner = task.get_task_runner(() => {
    for (let i = 0; i < 5; i++) {
      group_collision.aabb().size(5, 5).handle(a).group("grp")
    }
    group_collision.detect([{ a: "grp", b: "grp" }])
  })
  runner.next()

  expect(a.mock.calls.length).toBe(20)
})

test('colliders in different groups', () => {
  let group_collision = collision()
  let a = jest.fn()

  let runner = task.get_task_runner(() => {
    for (let i = 0; i < 5; i++) {
      group_collision.aabb().size(5, 5).handle(a).group("a")
      group_collision.aabb().size(5, 5).handle(a).group("b")
    }
    group_collision.detect([{ a: "a", b: "b" }])
  })
  runner.next()

  expect(a.mock.calls.length).toBe(50)
})

test('colliders without any group', () => {
  let group_collision = collision()
  let a = jest.fn()

  let runner = task.get_task_runner(() => {
    for (let i = 0; i < 5; i++) {
      group_collision.aabb().size(5, 5).handle(a)
    }
    group_collision.detect()
  })
  runner.next()

  expect(a.mock.calls.length).toBe(20)
})