import {Dataclass, mixin, replace, pluck} from '../src'

class Point extends Dataclass<{x: number, y: number}> {
  // use the fake `this` parameter if you want to update
  // type info on subclasses
  move<A extends this>(this: A, dx: number, dy: number) {
    const {x, y} = pluck(this)
    return replace(this, {x: x + dx, y: y + dy})
  }
}


class Rectangle extends Dataclass<{width: number, height: number}> {
  scale<A extends this>(this: A, dw: number, dh: number) {
    return replace(this, ({width, height}) => ({
      width: width + dw,
      height: height + dh
    }))
  }
}

// Apply previous classes as mixin, the result is a Dataclass itself (also can be used as mixin),
// with the fields of the the base dataclasses merged and methods inherithed
class Geometry extends mixin(Point, Rectangle) {
  moveAndScale(dx: number, dy: number, dw: number, dh: number) {
    return this.move(dx, dy).scale(dw, dh)
  }
}


const a = new Geometry({x: 0, y: 0, width: 100, height: 100})
const b = replace(a, {x: 100})
console.log(a)
console.log(b)
