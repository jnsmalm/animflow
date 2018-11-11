export class Vector {
  constructor(public x = 0, public y = 0) {
  }
  dot(vector: Vector) {
    return this.x * vector.x + this.y * vector.y
  }
  neg() {
    this.x = -this.x
    this.y = -this.y
    return this
  }
  mul(value: number) {
    this.x *= value
    this.y *= value
    return this
  }
  add(vector: Vector) {
    this.x += vector.x
    this.y += vector.y
    return this
  }
  sub(vector: Vector) {
    this.x -= vector.x
    this.y -= vector.y
    return this
  }
  set(x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }
}