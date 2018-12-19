import { sat } from "./sat"
import { vector } from "./vector"
import { aabb } from "./aabb"
import { sphere } from "./sphere"
import { task } from "./task"

interface collider {
  type: () => string
  collision: (mtv: vector, object: any) => void
  object: () => any
  center: () => vector
  points: () => vector[]
  radius: () => number
}

export function collision() {
  let _colliders: { [group: string]: collider[] } = {
    "": []
  }

  return {
    aabb: (object: PIXI.Container) => {
      let _aabb = aabb(object)
      let _handle: (mtv: vector, object: any) => void
      let _group = ""

      let _collider = {
        type: () => {
          return "aabb"
        },
        collision: (mtv: vector, object: any) => {
          if (_handle) {
            _handle(mtv, object)
          }
        },
        object: () => {
          return object
        },
        center: () => {
          return _aabb.center()
        },
        points: () => {
          return _aabb.points()
        },
        radius: () => {
          return 0
        }
      }

      _colliders[_group].push(_collider)

      return {
        group: function (group: string) {
          task(function* (): IterableIterator<void> {
            _colliders[_group].splice(_colliders[_group].indexOf(_collider), 1)
            _group = group
            if (!_colliders[_group]) {
              _colliders[_group] = []
            }
            _colliders[_group].push(_collider)
          })
          return this
        },
        show: function () {
          _aabb.show()
          return this
        },
        size: function (x: number, y: number) {
          _aabb.size(x, y)
          return this
        },
        handle: function (handle: (mtv: vector, object: any) => void) {
          _handle = handle
          return this
        }
      }
    },
    sphere: (object: PIXI.Container) => {
      let _sphere = sphere(object)
      let _handle: (mtv: vector, object: any) => void
      let _group = ""

      let _collider = {
        type: () => {
          return "sphere"
        },
        collision: (mtv: vector, object: any) => {
          if (_handle) {
            _handle(mtv, object)
          }
        },
        object: () => {
          return object
        },
        center: () => {
          return _sphere.center()
        },
        points: () => {
          return _sphere.points()
        },
        radius: () => {
          return _sphere.radius() || 0
        }
      }

      _colliders[_group].push(_collider)

      return {
        group: function (group: string) {
          task(function* (): IterableIterator<void> {
            _colliders[_group].splice(_colliders[_group].indexOf(_collider), 1)
            _group = group
            if (!_colliders[_group]) {
              _colliders[_group] = []
            }
            _colliders[_group].push(_collider)
          })
          return this
        },
        show: function () {
          _sphere.show()
          return this
        },
        size: function (radius: number) {
          _sphere.size(radius)
          return this
        },
        handle: function (handle: (mtv: vector, object: any) => void) {
          _handle = handle
          return this
        }
      }
    },
    detect: (groups = [{ a: "", b: "" }]) => {
      task(function* (): IterableIterator<void> {
        for (let g of groups) {
          detect_group_collisions(_colliders[g.a], _colliders[g.b])
        }
      })
    }
  }
}

function aabb_to_aabb(a: collider, b: collider) {
  let axes = [
    vector(0, 1),
    vector(1, 0)
  ]
  return sat(a, b, axes)
}

function sphere_to_sphere(a: collider, b: collider) {
  let axes = [
    vector.normalize(vector.sub(a.center(), b.center()))
  ]
  return sat(a, b, axes)
}

function detect_collision(a: collider, b: collider) {
  if (a.type() === "aabb") {
    if (b.type() === "aabb") {
      return aabb_to_aabb(a, b)
    }
  }
  if (a.type() === "sphere") {
    if (b.type() === "sphere") {
      return sphere_to_sphere(a, b)
    }
  }
}

function detect_group_collisions(a: collider[], b: collider[]) {
  if (!a || !b) {
    return
  }
  for (let i = 0; i < a.length; i++) {
    for (let j = (a === b ? i + 1 : 0); j < b.length; j++) {
      if (a[i] === b[j]) {
        continue
      }
      let mtv = detect_collision(a[i], b[j])
      if (!mtv) {
        continue
      }
      a[i].collision(mtv, b[j].object())
      b[j].collision(vector.neg(mtv), a[i].object())
    }
  }
}