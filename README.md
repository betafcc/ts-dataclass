# @betafcc/dataclass

Small 'dataclass' utility that allows type-safe mixins and mutation-free transformations

## install

```
npm i @betafcc/dataclass
```

## Usage

Define fields in `Dataclass<{...props}>` and extend it:

```ts
import {Dataclass} from '@betafcc/dataclass'

class Point extends Dataclass<{x: number, y: number}> { }
```

The constructor with the typed signature will be created for you:

![](prints/point_intellisense.png)


Use `pluck` to read fields:

```ts
import {pluck} from '@betafcc/dataclass'

const p = new Point({x: 100, y: 200})

const {x} = pluck(p) // x = 100
const y = pluck(p, 'y') // y = 200
const xy = pluck(p, ['x', 'y']) // xy = [100, 200]
```

And `replace` to 'change' them (actually, create new objects with the modifications)

```ts
import {replace} from '@betafcc/dataclass'

console.log(replace(p, {x: 200})) // Point({x: 200, y: 200})
console.log(p) // still Point({x: 100, y: 200})

// can use with a function from current fields:
console.log(replace(p, old => ({
  x: old.x + old.y
}))) // Point({x: 300, y: 200})
```

More complete example, showing the use of mixins:

```ts
import {Dataclass, mixin, replace, pluck} from '@betafcc/dataclass'

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

```

The type system will detect the new fields:

![](prints/geometry_intellisense.png)

And inherited methods will know which class they belong now:

![](prints/method_intellisense.png)
