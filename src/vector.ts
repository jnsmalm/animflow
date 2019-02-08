export interface vector { x: number, y: number }

export function vector(x = 0, y = 0) {
  return { x: x, y: y }
}

vector.copy = (v: vector) => {
  return vector(v.x, v.y)
}

vector.add = (a: vector, b: vector) => {
  return vector(a.x + b.x, a.y + b.y)
}

vector.sub = (a: vector, b: vector) => {
  return vector(a.x - b.x, a.y - b.y)
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

vector.normalize = (v: vector) => {
  let length = vector.len(v)
  return vector(v.x / length, v.y / length)
}

vector.len = (v: vector) => {
  return Math.sqrt(v.x * v.x + v.y * v.y)
}