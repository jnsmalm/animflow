export const ease = {}

// Based on https://gist.github.com/gre/1650294

ease.linear = (t) => t

ease.sine_in = (t) => -1 * Math.cos(t * (Math.PI / 2)) + 1
ease.sine_inout = (t) => -0.5 * (Math.cos(Math.PI * t) - 1)
ease.sine_out = (t) => Math.sin(t * (Math.PI / 2))