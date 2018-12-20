import { time } from "./time"
import { sequence } from "./sequence"
import { thread } from "./thread"

let _application: PIXI.Application

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
  application: () => {
    return _application
  },
  stage: () => {
    return _application.stage
  },
  init: (width = 800, height = 600, autoscale = true) => {
    _application = new PIXI.Application({ width, height })

    _application.ticker.add(() => {
      time.elapsed(_application.ticker.elapsedMS / 1000)
      thread.run_all()
    })

    document.body.appendChild(_application.view)

    if (autoscale) {
      let resize = () => {
        _application.renderer.resize(window.innerWidth, window.innerHeight)
        _application.stage.position.set(window.innerWidth / 2, window.innerHeight / 2)
        _application.stage.scale.set(
          Math.min(window.innerWidth / width, window.innerHeight / height)
        )
      }
      window.onresize = resize
      resize()
    }
  }
}