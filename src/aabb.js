import { vector } from "./vector"
import { task } from "./task"
import { add_collider } from "./collision"

export function aabb(object) {
  let _handle_callback, _sizex, _sizey, _graphics, _visible = false, _group, _collider_aabb

  task(function* () {
    create_collider_graphics()
    add_collider(_collider_aabb)
  })

  function create_collider_graphics() {
    if (_graphics) {
      object.removeChild(_graphics)
    }
    let bounds = get_bounds_rectangle()
    _graphics = new PIXI.Graphics(true)
    _graphics.visible = _visible
    _graphics.lineStyle(_visible ? 0.0001 : 0, 0xff0000, 0.8)
    _graphics
      .moveTo(bounds.left, bounds.top)
      .lineTo(bounds.right, bounds.top)
      .lineTo(bounds.right, bounds.bottom)
      .lineTo(bounds.left, bounds.bottom)
      .lineTo(bounds.left, bounds.top)
    object.addChild(_graphics)
  }

  function get_bounds_rectangle() {
    if (_sizex && _sizey) {
      return new PIXI.Rectangle(_sizex / -2, _sizey / -2, _sizex, _sizey)
    }
    return object.getLocalBounds()
  }

  _collider_aabb = {
    group: function(value) {
      if (value !== undefined) {
        _group = value
        return this
      }
      return _group
    },
    center: function () {
      let { x, y } = object.getGlobalPosition()
      return vector(x, y)
    },
    object: function() {
      return object
    },
    handle: function (value) {
      _handle_callback = value
      return this
    },
    points: function () {
      let bounds = _graphics.getBounds()
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
  return _collider_aabb
}