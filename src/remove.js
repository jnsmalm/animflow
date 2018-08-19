import { task } from "./task"

export function remove(object) {
  task(function* () {
    if (object.parent) {
      object.parent.removeChild(object)
    }
  })
}