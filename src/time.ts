export module time {
  let _elapsed = 0

  export function elapsed(elapsed?: number) {
    if (elapsed !== undefined) {
      _elapsed = elapsed
    }
    return _elapsed
  }
}