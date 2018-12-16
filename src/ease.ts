// Based on https://gist.github.com/gre/1650294

export namespace ease {
  export function linear(t: number) {
    return t
  }
  export function sine_in(t: number) {
    return -1 * Math.cos(t * (Math.PI / 2)) + 1
  }
  export function sine_inout(t: number) {
    return -0.5 * (Math.cos(Math.PI * t) - 1)
  }
  export function sine_out(t: number) {
    return Math.sin(t * (Math.PI / 2))
  }
}