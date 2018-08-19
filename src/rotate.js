import { tween } from "./tween"
import { sequence } from "./sequence"
import { ease } from "./ease"

const deg_to_rad = (Math.PI * 2) / 360

export function rotate(object) {
  let _to
  let _by
  let _ease = ease.linear
  let _time = 0

  sequence(() => {
    let rotation = object.rotation
    if (_by !== undefined) {
      rotation = object.rotation + _by * deg_to_rad
    }
    if (_to !== undefined) {
      rotation = _to * deg_to_rad
    }
    tween(object).to({ rotation }).time(_time).ease(_ease)
  })

  return {
    to: function (value) {
      _to = value
      return this
    },
    by: function (value) {
      _by = value
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