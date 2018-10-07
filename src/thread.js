let _old_threads = [], _new_threads = [], _id = 0

function thread(job) {
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
    job: job, priority: 0, id: _id++, cancel: false
  }
  _new_threads.push(thread)
  return {
    cancel: function () {
      thread.cancel = true
    },
    priority: function (value) {
      thread.priority = value
      return this
    }
  }
}

function run_threads() {
  if (_new_threads.length > 0) {
    for (let i = 0; i < _new_threads.length; i++) {
      _old_threads.push(_new_threads[i])
    }
    _new_threads = []
  }
  do_threads(_old_threads)

  // New threads might have been added, run those in the same frame.
  do_threads(_new_threads)
}

function do_threads(threads) {
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

module.exports.thread = thread
module.exports.run_threads = run_threads