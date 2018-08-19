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
  _threads.push(job)
}

export function run_threads() {
  for (let i = _threads.length - 1; i >= 0; i--) {
    if (_threads[i].next().done) {
      _threads.splice(i, 1)
    }
  }
}