import { time } from "./time"
import { task } from "./task"
import { ease } from "./ease"

export function tween(object) {
  let _ease = ease.linear
  let _to = {}
  let _time = 0

  task(function* () {
    let from = {}
    for (let prop in _to) {
      from[prop] = object[prop]
    }
    let elapsed_time = 0
    while (elapsed_time < _time && _time > 0) {
      elapsed_time += time()
      for (let prop in from) {
        object[prop] = interpolation(from[prop],
          _to[prop], Math.min(1, elapsed_time / _time), _ease)
      }
      yield
    }
    for (let prop in from) {
      object[prop] = _to[prop]
    }
  })

  return {
    to: function (value) {
      _to = value
      return this
    },
    ease: function (value = ease.sine_inout) {
      _ease = value
      return this
    },
    time: function (value) {
      _time = value
      return this
    }
  }
}

function interpolation(a, b, t, easing) {
  return a + (b - a) * easing(t)
}