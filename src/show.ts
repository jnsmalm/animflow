import { tween } from "./tween"
import { sequence } from "./sequence"

export function show(object: { alpha: number }) {
  let _time = 0

  sequence(() => {
    tween(object).to({ alpha: 1 }).time(_time)
  })

  return {
    time: function (value: number) {
      _time = value
    }
  }
}