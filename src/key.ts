import { task } from "./task"
import { sequence } from "./sequence"
import { repeat } from "./repeat"

export function key(key: string) {
  return {
    down: (job: () => void) => {
      let handler: () => void
      task(function* (): IterableIterator<void> {
        handler = add_handler(key, "down", job)
      })
      return {
        cancel: () => {
          task(function* (): IterableIterator<void> {
            remove_handler(key, "down", handler)
          })
        }
      }
    },
    up: (job: () => void) => {
      let handler: () => void
      task(function* (): IterableIterator<void> {
        handler = add_handler(key, "up", job)
      })
      return {
        cancel: () => {
          task(function* (): IterableIterator<void> {
            remove_handler(key, "up", handler)
          })
        }
      }
    },
    repeat: (job: () => void) => {
      let down_handler: () => void
      let up_handler: () => void
      let _repeat: { cancel: () => void }

      task(function* (): IterableIterator<void> {
        down_handler = add_handler(key, "down", () => {
          _repeat = repeat(job)
        })
        up_handler = add_handler(key, "up", () => {
          if (_repeat) {
            _repeat.cancel()
          }
        })
      })
      return {
        cancel: () => {
          if (_repeat) {
            _repeat.cancel()
          }
          task(function* (): IterableIterator<void> {
            remove_handler(key, "down", down_handler)
            remove_handler(key, "up", up_handler)
          })
        }
      }
    },
  }
}

let _handlers: { [name: string]: any } = { down: {}, up: {} }

function add_handler(key: string, type: string, job: () => void) {
  key = key.toLowerCase()
  let seq: { completed: () => boolean }
  if (!_handlers[type][key]) {
    _handlers[type][key] = []
  }
  let handler = () => {
    if (seq && !seq.completed()) {
      return
    }
    seq = sequence(job)
  }
  _handlers[type][key].push(handler)
  return handler
}

function remove_handler(key: string, type: string, handler: () => void) {
  key = key.toLowerCase()
  if (!_handlers[type][key]) {
    return
  }
  let index = _handlers[type][key].indexOf(handler)
  _handlers[type][key].splice(index, 1)
}

document.addEventListener("keydown", (evt) => {
  let key = evt.key.toLowerCase()
  if (!_handlers.down[key] || _handlers.down[key].length === 0) {
    return
  }
  _handlers.down[key].slice(-1)[0]()
})

document.addEventListener("keyup", (evt) => {
  let key = evt.key.toLowerCase()
  if (!_handlers.up[key] || _handlers.up[key].length === 0) {
    return
  }
  _handlers.up[key].slice(-1)[0]()
})