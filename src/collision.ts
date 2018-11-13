import { sat } from "./sat"
import { proceed } from "./proceed"
import { repeat } from "./repeat"
import { vector } from "./vector";

interface collider {
  group: () => string
  type: () => string
  collision: (mtv: vector, object: any) => void
  object: () => any
  center: () => vector
  points: () => vector[]
  radius: () => number
}

let _colliders: { [group: string]: collider[] } = {}

export function add_collider(collider: collider) {
  let group = collider.group() || ""
  if (!_colliders[group]) {
    _colliders[group] = []
  }
  _colliders[group].push(collider)
}

export function collision(groups = [{ a: "", b: "" }]) {
  let _proceed = proceed(() => {
    repeat(() => {
      for (let g of groups) {
        detect_group_collisions(_colliders[g.a], _colliders[g.b])
      }
    })
  }).priority(100)

  return {
    cancel: () => {
      _proceed.cancel()
    }
  }
}

function aabb_to_aabb(a: collider, b: collider) {
  let axes = [
    vector(0, 1),
    vector(1, 0)
  ]
  return sat(a, b, axes) as vector
}

function sphere_to_sphere(a: collider, b: collider) {
  let axes = [
    vector.normalize(vector.sub(a.center(), b.center()))
  ]
  return sat(a, b, axes)
}

function detect_collisions(a: collider, b: collider) {
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
      let mtv = detect_collisions(a[i], b[j]) as vector
      if (!mtv) {
        continue
      }
      proceed(() => {
        a[i].collision(mtv, b[j].object)
      })
      proceed(() => {
        b[j].collision(vector.neg(mtv), a[i].object)
      })
    }
  }
}