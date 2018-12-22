import { tween } from "./tween"
import { sequence } from "./sequence"

export function hide(object: { alpha: number }) {
  let _time = 0

  sequence(() => {
    tween(object).to({ alpha: 0 }).time(_time)
  })

  return {
    time: function (value: number) {
      _time = value
    }
  }
}