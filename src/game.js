import { sequence } from "./sequence"

export let game = {}

game.init = (config = {}) => {
  let { width = 800, height = 600, autoscale = true } = config

  game.renderer = PIXI.autoDetectRenderer({ width, height })
  game.root = new PIXI.Container()
  document.body.appendChild(game.renderer.view)

  if (autoscale) {
    window.onresize = () => {
      game.renderer.resize(window.innerWidth, window.innerHeight)
      game.root.position.set(window.innerWidth / 2, window.innerHeight / 2)
      game.root.scale.set(
        Math.min(window.innerWidth / width, window.innerHeight / height)
      )
    }
    window.onresize()
  }
}

game.load = (start) => {
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

game.render = () => {
  if (!game.renderer) {
    return
  }
  game.renderer.render(game.root)
}