import { vector } from "./vector"
import { task } from "./task"

export function aabb(object) {
  let _handle_callback, _sizex, _sizey, _collider, _visible = false

  task(function* () {
    create_collider_graphics()
  })

  function create_collider_graphics() {
    if (_collider) {
      object.removeChild(_collider)
    }
    let bounds = get_bounds_rectangle()
    _collider = new PIXI.Graphics(true)
    _collider.visible = _visible
    _collider.lineStyle(_visible ? 0.0001 : 0, 0xff0000, 0.8)
    _collider
      .moveTo(bounds.left, bounds.top)
      .lineTo(bounds.right, bounds.top)
      .lineTo(bounds.right, bounds.bottom)
      .lineTo(bounds.left, bounds.bottom)
      .lineTo(bounds.left, bounds.top)
    object.addChild(_collider)
  }

  function get_bounds_rectangle() {
    if (_sizex && _sizey) {
      return new PIXI.Rectangle(_sizex / -2, _sizey / -2, _sizex, _sizey)
    }
    return object.getLocalBounds()
  }

  return {
    center: function () {
      let { x, y } = object.getGlobalPosition()
      return vector(x, y)
    },
    handle: function (value) {
      _handle_callback = value
      return this
    },
    points: function () {
      let bounds = _collider.getBounds()
      return [
        vector(bounds.left, bounds.top),
        vector(bounds.right, bounds.bottom),
        vector(bounds.right, bounds.top),
        vector(bounds.left, bounds.bottom)
      ]
    },
    size: function (x, y) {
      _sizex = x
      _sizey = y
      task(function* () {
        create_collider_graphics()
      })
      return this
    },
    show: function () {
      _visible = true
      task(function* () {
        create_collider_graphics()
      })
      return this
    },
    collision: function (collider, mtv) {
      if (_handle_callback) {
        _handle_callback(collider, mtv)
      }
    }
  }
}