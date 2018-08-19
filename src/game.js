import { sequence } from "./sequence"

export let game = {}

game.init = (width = 800, height = 600) => {
  game.renderer = PIXI.autoDetectRenderer({ width, height })
  game.root = new PIXI.Container()
  document.body.appendChild(game.renderer.view)
}

game.load = () => {
  fetch("konfig.json").then((res) => {
    return res.json()
  }).then((config) => {
    Object.assign(game, config)
    for (let name in config.bilder) {
      PIXI.loader.add(name, config.bilder[name].url)
    }
    PIXI.loader.load(() => {
      sequence(game.start)
    })
  })
}

game.render = () => {
  if (!game.renderer) {
    return
  }
  game.renderer.render(game.root)
}

game.autoscale = () => {
  let w = game.renderer.width
  let h = game.renderer.height

  window.onresize = () => {
    game.renderer.resize(window.innerWidth, window.innerHeight)
    game.root.position.set(window.innerWidth / 2, window.innerHeight / 2)
    game.root.scale.set(
      Math.min(window.innerWidth / w, window.innerHeight / h)
    )
  }
  window.onresize()
}