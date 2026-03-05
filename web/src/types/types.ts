import type {
  ConvertedGroup,
  ConvertedService,
  ConvertedUser,
} from "../../../service/src/types/types.ts";
type AllRequired<T> = {
  [P in keyof T]-?: T[P] extends object | undefined
    ? AllRequired<Exclude<T[P], undefined>>
    : Exclude<T[P], undefined>;
};

type ReceivingConvertedUser = AllRequired<ConvertedUser>;
type ReceivingConvertedService = AllRequired<ConvertedService>;
type ReceivingConvertedGroup = AllRequired<ConvertedGroup>;
type StringKeys<T> = Exclude<
  {
    [K in keyof Flatten<T>]: Flatten<T>[K] extends string | undefined ? K
      : never;
  }[keyof Flatten<T>],
  undefined
>;

export type {
  ConvertedGroup,
  ConvertedService,
  ConvertedUser,
  ReceivingConvertedGroup,
  ReceivingConvertedService,
  ReceivingConvertedUser,
  StringKeys,
};
type Flatten<T> = {
  [K in keyof T as K extends string ? K : never]: T[K] extends object
    ? T[K] extends Array<unknown> ? T[K]
    : Flatten<T[K]>
    : T[K];
};
