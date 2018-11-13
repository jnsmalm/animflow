import { vector } from "./vector"
import { task } from "./task"
import { add_collider } from "./collision"

export function sphere(object: PIXI.Container) {
  let _handle_callback: (mtv: vector, object: any) => void
  let _radius: number
  let _graphics: PIXI.Graphics
  let _visible = false
  let _group = ""

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

  let sphere = {
    points: function () {
      return [
        this.center()
      ]
    },
    radius: () => {
      return _graphics.getBounds().width / 2
    },
    type: () => {
      return "sphere"
    },
    group: () => {
      return _group
    },
    center: function () {
      let { x, y } = object.getGlobalPosition()
      return vector(x, y)
    },
    object: function () {
      return object
    },
    collision: function (mtv: vector, object: any) {
      if (_handle_callback) {
        _handle_callback(mtv, object)
      }
    }
  }

  task(function* (): IterableIterator<void> {
    create_collider_graphics()
    add_collider(sphere)
  })

  return {
    group: function (value: string) {
      _group = value
      return this
    },
    handle: function (value: (mtv: vector, object: any) => void) {
      _handle_callback = value
      return this
    },
    size: function (radius: number) {
      _radius = radius
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