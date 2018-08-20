const { game, sprite, key, move, ease } = VILLE

game.init()
game.autoscale()

game.load(() => {
  let mario = sprite("mario")
  key(" ").down(() => {
    move(mario).by({ y: -100 }).time(0.2).ease(ease.sine_out)
    move(mario).by({ y: +100 }).time(0.2).ease(ease.sine_in)
  })
})