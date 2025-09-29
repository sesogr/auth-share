import { Spy } from "@std/testing/mock";

export type SpyObject<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => infer Return
    ? Spy<unknown, Args, Return>
    : never;
};
