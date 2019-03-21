// Just a trick for strict computation of intersections
// ie, A & B won't be merged in intellisense completion,
// Merge<A & B> will
export type Merge<A> = ReturnType<() => { [P in keyof A]: A[P] }>
export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>
export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]
// TODO: maybe merge static properties?
export type TypeOfDataclass<A extends Dataclass<any>> = {
  new(props: A['props']): A
}
export type MixinDataclasses<A extends Dataclass<any>, B extends Dataclass<any>> = {
  new(props: Merge<A['props'] & B['props']>): Merge<
    FunctionProperties<A>
    & FunctionProperties<B>
    & { readonly props: A['props'] & B['props'] }
  >
}

export class Dataclass<T extends object = {}> {
  constructor(readonly props: T) { }
}

export function mixin<
  A extends Dataclass<any>,
  B extends Dataclass<any>
>(
  CtorA: TypeOfDataclass<A>,
  CtorB: TypeOfDataclass<B>
) {
  const Merged = class extends Dataclass<A['props'] & B['props']> { }

  applyMixins(Merged, [CtorA, CtorB])

  return Merged as MixinDataclasses<A, B>
}

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name]
    })
  })
}

// TODO: restrain new props that are in obj.props
export function replace<T extends Dataclass<any>>(
  obj: T,
  props: Partial<T['props']> | ((arg: T['props']) => object)
): T {
  return new (Object.getPrototypeOf(obj)).constructor({
    ...obj.props,
    ...((typeof props === 'function') ? props(obj.props) : props)
  })
}

export function pluck
  <T extends Dataclass<any>, K extends keyof T['props']>
  (obj: T, key: K)
  : T['props'][K]
export function pluck
  <T extends Dataclass<any>, K extends keyof T['props']>
  (obj: T, key: K[])
  : T['props'][K][]
export function pluck
  <T extends Dataclass<any>, K extends keyof T['props']>
  (obj: T, key: K | K[])
  : T['props'][K] | T['props'][K][] {
  return obj.props[key];
}
