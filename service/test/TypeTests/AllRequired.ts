export type AllRequired<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>;
};
