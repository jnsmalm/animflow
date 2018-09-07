import { sat } from "./sat"
import { task } from "./task";

function collider(a) {
  return {
    object: a.object(), center: a.center(), points: a.points()
  }
}

function colliders(array) {
  if (!Array.isArray(array)) {
    return [collider(array)]
  }
  let colliders = []
  for (let i = 0; i < array.length; i++) {
    colliders.push(collider(array[i]))
  }
  return colliders
}

export function collision(group_a, group_b) {
  let _handle

  task(function* () {
    let colliders_a = colliders(group_a)
    let colliders_b = colliders(group_b)

    for (let i = 0; i < colliders_a.length; i++) {
      for (let j = 0; j < colliders_b.length; j++) {
        if (colliders_a[i] === colliders_b[i]) {
          continue;
        }
        let mtv = sat(colliders_a[i], colliders_b[j])
        if (mtv) {
          let a = colliders_a[i].object
          let b = colliders_b[i].object
          _handle(a, b, mtv)
        }
      }
    }
  })

  return {
    handle: (handle_callback) => {
      _handle = handle_callback
    } 
  }
}