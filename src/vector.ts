export interface vector {
  x: number,
  y: number
}

export function vector(x = 0, y = 0) {
  return { x: x, y: y }
}

vector.add = (a: vector, b: vector) => {
  return vector(a.x + a.y, b.y + b.y)
}

vector.sub = (a: vector, b: vector) => {
  return vector(a.x - a.y, b.y - b.y)
}

vector.dot = (a: vector, b: vector) => {
  return a.x * b.x + a.y * b.y
}

vector.mul = (v: vector, value: number) => {
  return vector(v.x * value, v.y * value)
}

vector.neg = (v: vector) => {
  return vector(v.x * -1, v.y * -1)
}