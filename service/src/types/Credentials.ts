import { assertIsStringRecord } from "./types.ts";

export type Credentials = {
  username?: string;
  password?: string;
};

export function assertIsCredentials<K extends keyof Credentials = never>(
  obj: unknown,
  assertion?: K[] | K,
): asserts obj is Credentials {
  assertIsStringRecord(obj);
  if (assertion) {
    if (Array.isArray(assertion)) {
      for (const key of assertion) {
        if (obj[key] === undefined || obj[key] === null) {
          throw new TypeError(`Missing property: ${key}`);
        }
      }
    } else {
      if (obj[assertion] === undefined || obj[assertion] === null) {
        throw new TypeError(`Missing property: ${assertion}`);
      }
    }
  } else {
    const requiredProperties: (keyof Credentials)[] = ["username", "password"];
    for (const prop of requiredProperties) {
      if (obj[prop] === undefined || obj[prop] === null) {
        throw new TypeError(`Missing property: ${prop}`);
      }
    }
  }
}
