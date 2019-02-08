import { vector } from "./vector"
import { task } from "./task"

export function sphere(object?: PIXI.Container) {
  let _radius: number
  let _center = vector()
  let _graphics: PIXI.Graphics
  let _visible = false

  function create_collider_graphics() {
    if (!object) {
      return
    }
    if (_graphics) {
      object.removeChild(_graphics)
    }
    let radius = _radius
    if (!radius) {
      radius = object.getLocalBounds().width / 2
    }
    _graphics = new PIXI.Graphics(true)
    _graphics.visible = _visible
    _graphics.lineStyle(_visible ? 0.0001 : 0, 0xff0000, 0.8)
    _graphics.drawCircle(0, 0, radius)

    object.addChild(_graphics)
  }

  create_collider_graphics()

  return {
    points: function () {
      return [this.center()]
    },
    radius: function (radius?: number) {
      if (radius !== undefined) {
        _radius = radius
        task(function* (): IterableIterator<void> {
          create_collider_graphics()
        })
      }
      if (_graphics) {
        return _graphics.getBounds().width / 2
      }
      return _radius
    },
    show: function () {
      _visible = true
      task(function* (): IterableIterator<void> {
        create_collider_graphics()
      })
    },
    center: function (center?: vector) {
      if (center) {
        _center = vector.copy(center)
      }
      if (!object) {
        return vector(_center.x, _center.y)
      }
      let { x, y } = object.getGlobalPosition()
      return vector(x, y)
    }
  }
}