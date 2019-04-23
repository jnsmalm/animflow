import { time } from "./time"
import { sequence } from "./sequence"
import { process } from "./process"

export namespace game {
  export let app: PIXI.Application

  export function load(start: () => void) {
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
  }

  export function init(width = 800, height = 600, autoscale = true) {
    app = new PIXI.Application({ width, height })

    app.ticker.add(() => {
      time.elapsed(app.ticker.elapsedMS / 1000)
      process.run_all()
    })

    document.body.appendChild(app.view)

    if (autoscale) {
      let resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight)
        app.stage.position.set(window.innerWidth / 2, window.innerHeight / 2)
        app.stage.scale.set(
          Math.min(window.innerWidth / width, window.innerHeight / height)
        )
      }
      window.onresize = resize
      resize()
    }
  }
}