class Vector {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
  dot(vector) {
    return this.x * vector.x + this.y * vector.y
  }
  neg() {
    this.x = -this.x
    this.y = -this.y
    return this
  }
  mul(value) {
    this.x *= value
    this.y *= value
    return this
  }
  add(vector) {
    this.x += vector.x
    this.y += vector.y
    return this
  }
  sub(vector) {
    this.x -= vector.x
    this.y -= vector.y
    return this
  }
  set(x, y) {
    this.x = x
    this.y = y
    return this
  }
}

export function vector(x, y) {
  return new Vector(x, y)
}