import type {
  ConvertedGroup,
  ConvertedService,
  ConvertedUser,
  Credentials,
} from "../../../service/src/types/types.ts";
type Flatten<T> = T extends { credentials?: Credentials }
  ? T & { [K in keyof Credentials]: Credentials[K] }
  : T;
type AllRequired<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>;
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
  Credentials,
  ReceivingConvertedGroup,
  ReceivingConvertedService,
  ReceivingConvertedUser,
  StringKeys,
};
