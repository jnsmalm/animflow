import { tween } from "./tween"
import { sequence } from "./sequence"

export function show(object) {
  let _time = 0

  sequence(() => {
    tween(object).to({ alpha: 1 }).time(_time)
  })

  return {
    time: function (value) {
      _time = value
    }
  }
}