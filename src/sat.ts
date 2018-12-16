import { vector } from "./vector"

interface shape {
  center: () => vector
  points: () => vector[]
  radius: () => number
}

function project_shape(shape: shape, axis: vector) {
  let points = shape.points()
  let radius = shape.radius()

  let dot = vector.dot(points[0], axis)
  let min = dot
  let max = dot
  for (let i = 1; i < points.length; i++) {
    dot = vector.dot(points[i], axis)
    min = Math.min(dot, min)
    max = Math.max(dot, max)
  }
  return new projection(min - radius, max + radius)
}

class projection {
  constructor(private min: number, private max: number) { }

  overlap(proj: projection) {
    if (this.min < proj.min) {
      return proj.min - this.max
    } else {
      return this.min - proj.max
    }
  }
}

export function sat(a: shape, b: shape, axes: vector[]) {
  let overlap = Number.MAX_VALUE
  let mtv = vector()

  for (let axis of axes) {
    let p1 = project_shape(a, axis)
    let p2 = project_shape(b, axis)
    if (p1.overlap(p2) >= 0) {
      return undefined
    }
    if (Math.abs(p1.overlap(p2)) < overlap) {
      overlap = Math.abs(p1.overlap(p2))
      mtv = axis
    }
  }

  let d = vector.sub(a.center(), b.center())
  if (vector.dot(d, mtv) < 0) {
    mtv = vector.neg(mtv)
  }
  return vector.mul(mtv, overlap)
}