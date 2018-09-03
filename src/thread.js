let _threads = []

export function thread(job) {
  if (typeof job !== "function") {
    throw new TypeError(
      "A thread only acceps a 'generator function' as an argument")
  }
  job = job()
  if (!job || !job.next) {
    throw new TypeError(
      "A thread only acceps a 'generator function' as an argument")
  }
  let thread = {
    job: job, priority: 0
  }
  _threads.push(thread)
  return {
    priority: function (value) {
      thread.priority = value
    }
  }
}

export function run_threads() {
  _threads.reverse()
  _threads.sort((a, b) => {
    return b.priority - a.priority
  })
  for (let i = _threads.length - 1; i >= 0; i--) {
    if (_threads[i].job.next().done) {
      _threads.splice(i, 1)
    }
  }
}