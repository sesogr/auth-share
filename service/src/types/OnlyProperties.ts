export type OnlyProperties<T> = {
  [K in keyof T as T[K] extends (...args: never[]) => unknown ? never : K]:
    T[K];
};
