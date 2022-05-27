export type Primitive = string | number | boolean | undefined | null | bigint | symbol
export type Builtin = Primitive | Function | Date | RegExp | Error

export type IsTuple<T> = T extends any[] ? (any[] extends T ? never : T) : never

export type MaybePromise<T> = T | Promise<T>

export type NonNullable<T> = T extends null ? never : T
export type NonUndefinable<T> = T extends undefined ? never : T
export type NonNullish<T> = NonNullable<NonUndefinable<T>>

export type DeepUndefinable<T> =
  T extends Builtin ? T | undefined
  : T extends Array<infer U> ? T extends IsTuple<T>
    ? { [K in keyof T]: DeepUndefinable<T[K]> | undefined }
    : Array<DeepUndefinable<U>>
  : T extends Map<infer K, infer V> ? Map<DeepUndefinable<K>, DeepUndefinable<V>>
  : T extends Set<infer U> ? Set<DeepUndefinable<U>>
  : T extends Promise<infer U> ? Promise<DeepUndefinable<U>>
  : T extends {} ? { [K in keyof T]: DeepUndefinable<T[K]> }
  : T | undefined

export type DeepNonUndefinable<T> =
  T extends Builtin ? NonUndefinable<T>
  : T extends Array<infer U> ? T extends IsTuple<T>
    ? { [K in keyof T]: NonUndefinable<DeepNonUndefinable<T[K]>> }
    : Array<DeepNonUndefinable<U>>
  : T extends Map<infer K, infer V> ? Map<DeepNonUndefinable<K>, DeepNonUndefinable<V>>
  : T extends Set<infer U> ? Set<DeepNonUndefinable<U>>
  : T extends Promise<infer U> ? Promise<DeepNonUndefinable<U>>
  : T extends {} ? { [K in keyof T]: NonUndefinable<DeepNonUndefinable<T[K]>> }
  : NonUndefinable<T>


// captures all possibly undefined fields of an object and makes them required.
// useful for typing default arguments
export type UndefinableFields<T> = T extends Record<string, any>
  ? Required<{
    [K in keyof T as undefined extends T[K] ? K : never]: T extends {} ? DeepNonUndefinable<Required<T[K]>> : T[K]
  }>
  : never