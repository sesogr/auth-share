/**
 * Make all Properties optional but recursively
 */

export type _AllOptional<T> = {
  [K in keyof T]?: T[K] extends // deno-lint-ignore no-explicit-any
  (...arg: any[]) => any | string | number | boolean ? T[K]
    : _AllOptional<T[K]>;
};
