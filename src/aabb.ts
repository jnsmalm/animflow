import { vector } from "./vector"
import { task } from "./task"

export function aabb(object: PIXI.Container) {
  let _sizex: number, _sizey: number
  let _visible = false
  let _graphics: PIXI.Graphics

  function create_collider_graphics() {
    if (_graphics) {
      object.removeChild(_graphics)
    }
    let bounds: PIXI.Rectangle
    if (_sizex && _sizey) {
      bounds = new PIXI.Rectangle(_sizex / -2, _sizey / -2, _sizex, _sizey)
    } else {
      bounds = object.getLocalBounds()
    }
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

  create_collider_graphics()

  return {
    points: () => {
      let bounds = _graphics.getBounds()
      return [
        vector(bounds.left, bounds.top),
        vector(bounds.right, bounds.bottom),
        vector(bounds.right, bounds.top),
        vector(bounds.left, bounds.bottom)
      ]
    },
    size: function (x: number, y: number) {
      _sizex = x
      _sizey = y
      task(function* (): IterableIterator<void> {
        create_collider_graphics()
      })
    },
    show: function () {
      _visible = true
      task(function* (): IterableIterator<void> {
        create_collider_graphics()
      })
    },
    center: function () {
      let { x, y } = object.getGlobalPosition()
      return vector(x, y)
    }
  }
}