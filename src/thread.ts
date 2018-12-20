interface thread {
  id: number
  priority: number
  cancel: boolean
  job: IterableIterator<void>
}

let _old_threads: thread[] = []
let _new_threads: thread[] = []
let _next_thread_id = 0

/**
 * Creates a new thread
 * @param job The generator function to execute
 */
export function thread(job: () => IterableIterator<void>) {
  if (typeof job !== "function") {
    throw new TypeError(
      "A thread only acceps a 'generator function' as an argument")
  }
  let jo = job()
  if (!jo || !jo.next) {
    throw new TypeError(
      "A thread only acceps a 'generator function' as an argument")
  }
  let thread = {
    job: jo, priority: 0, id: _next_thread_id++, cancel: false
  }
  _new_threads.push(thread)
  return {
    cancel: function () {
      thread.cancel = true
    },
    priority: function (value: number) {
      thread.priority = value
      return this
    }
  }
}

/**
 * Runs all the threads
 */
thread.run_all = function () {
  if (_new_threads.length > 0) {
    for (let i = 0; i < _new_threads.length; i++) {
      _old_threads.push(_new_threads[i])
    }
    _new_threads = []
  }
  execute_threads(_old_threads)

  // New threads might have been added, run those in the same frame.
  execute_threads(_new_threads)
}

function execute_threads(threads: thread[]) {
  threads.sort((a, b) => {
    if (a.priority === b.priority) {
      return b.id - a.id
    }
    return b.priority - a.priority
  })
  for (let i = threads.length - 1; i >= 0; i--) {
    if (threads[i].cancel || threads[i].job.next().done) {
      threads.splice(i, 1)
    }
  }
}