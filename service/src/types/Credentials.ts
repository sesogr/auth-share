import { assertIsStringRecord, FilterForValues, typeCheck } from "./types.ts";

export type Credentials = {
  username?: string;
  password?: string;
};

export function assertIsCredentials<K extends keyof Credentials = never>(
  obj: unknown,
  assertion?: K[] | K,
): asserts obj is {
  [k in keyof Credentials]-?: Exclude<Credentials[k], undefined>;
}[keyof Credentials] {
  assertIsStringRecord(obj);
  const allKeys: FilterForValues<Credentials, (string | undefined)>[] = [
    "password",
    "username",
  ];
  if (assertion) {
    if (Array.isArray(assertion)) {
      for (const key of assertion) {
        typeCheck(obj, key);
      }
    } else {
      typeCheck(obj, assertion);
    }
  } else {
    for (const prop of allKeys) {
      typeCheck(obj, prop, "object", true);
      obj[prop];
    }
  }
}
