import { sat } from "./sat"
import { proceed } from "./proceed"
import { repeat } from "./repeat"

let _colliders = {}

export function add_collider(collider) {
  let group = collider.group() || ""
  if (!_colliders[group]) {
    _colliders[group] = []
  }
  _colliders[group].push(collider)
}

export function collision(groups = [{ a: "", b: "" }]) {
  let _proceed = proceed(() => {
    repeat(() => {
      let colliders = get_colliders()
      for (let g of groups) {
        detect_collisions(colliders[g.a], colliders[g.b])
      }
    })
  }).priority(100)

  return {
    cancel: () => {
      _proceed.cancel()
    }
  }
}

function get_colliders() {
  let result = {}
  for (let name in _colliders) {
    result[name] = []
    for (let c of _colliders[name]) {
      result[name].push({
        object: c.object(),
        center: c.center(),
        points: c.points(),
        collision: c.collision
      })
    }
  }
  return result
}

function detect_collisions(a, b) {
  if (!a || !b) {
    return
  }
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (a[i] === b[j]) {
        continue
      }
      let mtv = sat(a[i], b[j])
      if (!mtv) {
        continue
      }
      proceed(() => {
        a[i].collision(b[j].object, mtv)
      })
      proceed(() => {
        b[j].collision(a[i].object, mtv.neg())
      })
    }
  }
}