import { task } from "./task"

export function sound(url: string) {
  let _completed = false

  task(function* (): IterableIterator<void> {
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