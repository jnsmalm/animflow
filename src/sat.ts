import { Vector } from "./vector"

export interface SATShape {
  center: () => Vector
  points: () => Vector[]
}

class Shape {
  constructor(public points: Vector[]) { }
  project(axis: Vector) {
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
  constructor(private min: number, private max: number) { }
  overlap(proj: Projection) {
    if (this.min < proj.min) {
      return proj.min - this.max
    } else {
      return this.min - proj.max
    }
  }
}

export function sat(collider_a: SATShape, collider_b: SATShape) {
  let axes = [
    new Vector(0, 1),
    new Vector(1, 0)
  ]
  let overlap = Number.MAX_VALUE
  let mtv = new Vector()
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