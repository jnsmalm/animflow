import { Vector } from "./vector"
import { task } from "./task"
import { add_collider } from "./collision"

export function aabb(object: any) {
  let _handle_callback: (mtv: Vector, object: any) => void
  let _sizex: number
  let _sizey: number
  let _graphics: PIXI.Graphics
  let _visible = false
  let _group = ""

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

  let aabb = {
    points: function () {
      let bounds = _graphics.getBounds()
      return [
        new Vector(bounds.left, bounds.top),
        new Vector(bounds.right, bounds.bottom),
        new Vector(bounds.right, bounds.top),
        new Vector(bounds.left, bounds.bottom)
      ]
    },
    group: () => {
      return _group
    },
    center: function () {
      let { x, y } = object.getGlobalPosition()
      return new Vector(x, y)
    },
    object: function () {
      return object
    },
    collision: function (mtv: Vector, object: any) {
      if (_handle_callback) {
        _handle_callback(mtv, object)
      }
    }
  }

  task(function* (): IterableIterator<void> {
    create_collider_graphics()
    add_collider(aabb)
  })

  return {
    group: function (value: string) {
      _group = value
      return this
    },
    handle: function (value: (mtv: Vector, object: any) => void) {
      _handle_callback = value
      return this
    },
    size: function (x: number, y: number) {
      _sizex = x
      _sizey = y
      task(function* (): IterableIterator<void> {
        create_collider_graphics()
      })
      return this
    },
    show: function () {
      _visible = true
      task(function* (): IterableIterator<void> {
        create_collider_graphics()
      })
      return this
    }
  }
}