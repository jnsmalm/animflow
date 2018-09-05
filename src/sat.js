import { vector } from "./vector"

class Shape {
  constructor(points) {
    this.points = points
  }
  project(axis) {
    let dot = this.points[0].dot(axis)
    let min = dot
    let max = dot
    for (let i = 1; i < this.points.length; i++) {
      dot = this.points[i].dot(axis)
      min = Math.min(dot, min)
      max = Math.max(dot, max)
    }
    return new Projection(min, max)
  }
}

class Projection {
  constructor(min, max) {
    this.min = min
    this.max = max
  }
  overlap(proj) {
    if (this.min < proj.min) {
      return proj.min - this.max
    } else {
      return this.min - proj.max
    }
  }
}

export function sat(collider_a, collider_b) {
  let axes = [
    vector(0, 1),
    vector(1, 0)
  ]
  let overlap = Number.MAX_VALUE
  let mtv = vector()
  let shape_a = new Shape(collider_a.points())
  let shape_b = new Shape(collider_b.points())

  for (let axis of axes) {
    let p1 = shape_a.project(axis)
    let p2 = shape_b.project(axis)
    if (p1.overlap(p2) >= 0) {
      return undefined
    }
    if (Math.abs(p1.overlap(p2)) < overlap) {
      overlap = Math.abs(p1.overlap(p2))
      mtv = axis
    }
  }

  let d = collider_a.center().sub(collider_b.center())
  if (d.dot(mtv) < 0) {
    mtv.neg()
  }
  return mtv.mul(overlap)
}