import { time } from "./time"
import { task } from "./task"
import { ease } from "./ease"

export function tween(object: { [name: string]: any }) {
  let _ease = ease.linear
  let _to: { [name: string]: any } = {}
  let _time = 0

  task(function* () {
    let from: { [name: string]: any } = {}
    for (let name in _to) {
      from[name] = (<any>object)[name]
    }
    let elapsed_time = 0
    while (elapsed_time < _time && _time > 0) {
      elapsed_time += time.elapsed()
      let t = Math.min(1, elapsed_time / _time)
      for (let prop in from) {
        object[prop] = lerp(from[prop], _to[prop], t, _ease)
      }
      yield
    }
    for (let prop in from) {
      object[prop] = _to[prop]
    }
  })

  return {
    to: function (value: any) {
      _to = value
      return this
    },
    ease: function (value = ease.sine_inout) {
      _ease = value
      return this
    },
    time: function (value: number) {
      _time = value
      return this
    }
  }
}

function lerp(a: number, b: number, t: number, easing: (t: number) => number) {
  return a + (b - a) * easing(t)
}