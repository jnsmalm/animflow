import { task } from "./task"
import { sequence } from "./sequence"

export function key(key) {
  return {
    down: (job) => {
      task(function* () {
        add_handler(key, "down", job)
      })
      return {
        cancel: () => {
          task(function* () {
            remove_handler(key, "down")
          })
        }
      }
    },
    up: (job) => {
      task(function* () {
        add_handler(key, "up", job)
      })
      return {
        cancel: () => {
          task(function* () {
            remove_handler(key, "up")
          })
        }
      }
    }
  }
}

let _handlers = { down: {}, up: {} }

function add_handler(key, type, job) {
  key = key.toLowerCase()
  let seq
  if (!_handlers[type][key]) {
    _handlers[type][key] = []
  }
  _handlers[type][key].push(() => {
    if (seq && !seq.completed()) {
      return
    }
    seq = sequence(job)
  })
}

function remove_handler(key, type) {
  key = key.toLowerCase()
  if (!_handlers[type][key]) {
    return
  }
  _handlers[type][key].pop()
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