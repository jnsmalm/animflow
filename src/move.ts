import { tween } from "./tween"
import { sequence } from "./sequence"
import { ease } from "./ease"

export function move(object: { x: number, y: number }) {
  let _to: { x?: number, y?: number } = {}
  let _by: { x?: number, y?: number } = {}
  let _ease = ease.linear
  let _time = 0

  sequence(() => {
    if (_to.x !== undefined || _to.y !== undefined) {
      tween(object).to(_to).time(_time).ease(_ease)
      return
    }
    if (_by.x !== undefined) {
      _by.x += object.x
    }
    if (_by.y !== undefined) {
      _by.y += object.y
    }
    tween(object).to(_by).time(_time).ease(_ease)
  })

  return {
    to: function (value: { x?: number, y?: number }) {
      if (value.x !== undefined) {
        _to.x = value.x
      }
      if (value.y !== undefined) {
        _to.y = value.y
      }
      return this
    },
    by: function (value: { x?: number, y?: number }) {
      if (value.x !== undefined) {
        _by.x = value.x
      }
      if (value.y !== undefined) {
        _by.y = value.y
      }
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