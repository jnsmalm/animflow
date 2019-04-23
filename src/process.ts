interface process {
  id: number
  iterator: IterableIterator<void>,
  priority: number
  cancel: boolean
}

let _old_processes: process[] = []
let _new_processes: process[] = []
let _next_process_id = 0

/**
 * Creates a new process
 * @param job The generator function to execute
 */
export function process(job: () => IterableIterator<void>) {
  if (typeof job !== "function") {
    throw new TypeError(
      "A process only acceps a 'generator function' as an argument")
  }
  let iterator = job()
  if (!iterator || !iterator.next) {
    throw new TypeError(
      "A process only acceps a 'generator function' as an argument")
  }
  let process = {
    iterator: iterator, priority: 0, id: _next_process_id++, cancel: false
  }
  _new_processes.push(process)
  return {
    cancel: function () {
      process.cancel = true
    },
    priority: function (value: number) {
      process.priority = value
      return this
    }
  }
}

/**
 * Runs all the processes
 */
process.run_all = function () {
  if (_new_processes.length > 0) {
    for (let i = 0; i < _new_processes.length; i++) {
      _old_processes.push(_new_processes[i])
    }
    _new_processes = []
  }
  execute_processes(_old_processes)

  // New processes might have been added, run those in the same frame.
  execute_processes(_new_processes)
}

function execute_processes(processes: process[]) {
  processes.sort((a, b) => {
    if (a.priority === b.priority) {
      return b.id - a.id
    }
    return b.priority - a.priority
  })
  for (let i = processes.length - 1; i >= 0; i--) {
    if (processes[i].cancel || processes[i].iterator.next().done) {
      processes.splice(i, 1)
    }
  }
}