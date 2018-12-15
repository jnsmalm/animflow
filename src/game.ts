import { sequence } from "./sequence"

let _renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer
let _stage: PIXI.Container

export let game = {
  load: (start: () => void) => {
    fetch("assets.json").then((res) => {
      if (res.ok) {
        return res.json()
      }
    }).then((assets) => {
      Object.assign(game, assets)
      for (let name in assets) {
        PIXI.loader.add(name, assets[name])
      }
      PIXI.loader.load(() => {
        if (!start) {
          return
        }
        sequence(start)
      })
    })
  },
  render: () => {
    if (!_renderer) {
      return
    }
    _renderer.render(_stage)
  },
  init: (width = 800, height = 600, autoscale = true) => {
    _renderer = PIXI.autoDetectRenderer({ width, height })
    _stage = new PIXI.Container()

    document.body.appendChild(_renderer.view)

    if (autoscale) {
      let resize = () => {
        _renderer.resize(window.innerWidth, window.innerHeight)
        _stage.position.set(window.innerWidth / 2, window.innerHeight / 2)
        _stage.scale.set(
          Math.min(window.innerWidth / width, window.innerHeight / height)
        )
      }
      window.onresize = resize
      resize()
    }
  },
  stage: () => {
    return _stage
  },
  renderer: () => {
    return _renderer
  }
}