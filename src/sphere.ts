import { vector } from "./vector"
import { task } from "./task"

export function sphere(object: PIXI.Container) {
  let _radius: number
  let _graphics: PIXI.Graphics
  let _visible = false

  function create_collider_graphics() {
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
      return [
        this.center()
      ]
    },
    size: function (radius: number) {
      _radius = radius
      task(function* (): IterableIterator<void> {
        create_collider_graphics()
      })
    },
    radius: function () {
      return _graphics.getBounds().width / 2
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