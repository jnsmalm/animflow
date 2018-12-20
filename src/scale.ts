import { tween } from "./tween"
import { sequence } from "./sequence"
import { ease } from "./ease"

export function scale(object: PIXI.DisplayObject) {
  let _to: { x?: number, y?: number } = {}
  let _by: { x?: number, y?: number } = {}
  let _ease = ease.linear
  let _time = 0

  sequence(() => {
    if (_to.x !== undefined || _to.y !== undefined) {
      tween(object.scale).to(_to).time(_time).ease(_ease)
      return
    }
    if (_by.x !== undefined) {
      _by.x += object.scale.x
    }
    if (_by.y !== undefined) {
      _by.y += object.scale.y
    }
    tween(object.scale).to(_by).time(_time).ease(_ease)
  })

  return {
    to: function (value: number | { x?: number, y?: number }) {
      if (typeof value === "number") {
        _to.x = value
        _to.y = value
      }
      else {
        if (value.x !== undefined) {
          _to.x = value.x
        }
        if (value.y !== undefined) {
          _to.y = value.y
        }
      }
      return this
    },
    by: function (value: number | { x?: number, y?: number }) {
      if (typeof value === "number") {
        _by.x = value
        _by.y = value
      }
      else {
        if (value.x !== undefined) {
          _by.x = value.x
        }
        if (value.y !== undefined) {
          _by.y = value.y
        }
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