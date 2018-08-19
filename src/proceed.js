import { task, get_tasks } from "./task"
import { thread } from "./thread"

export function proceed(job) {
  task(function* () {
    thread(function* () {
      let tasks = get_tasks(job)
      for (let task of tasks) {
        yield* task()
      }
    })
  })
}