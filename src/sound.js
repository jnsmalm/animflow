import { task } from "./task"

export function sound(url) {
  let _completed = false

  task(function* () {
    let audio = new Audio(url)
    audio.onended = () => {
      _completed = true
    }
    audio.play()
  })

  return {
    wait: function () {
      task(function* () {
        while (!_completed) {
          yield
        }
      })
    }
  }
}