import { FormlessError } from "../classes/errors/controllerErrors/FormlessError.ts";
import { MissingDataError } from "../classes/errors/controllerErrors/MissingDataError.ts";
import { ConvertedGroup } from "./ConvertedGroup.ts";
import { ConvertedService } from "./ConvertedService.ts";
import { ConvertedUser } from "./ConvertedUser.ts";
import { Credentials } from "./Credentials.ts";

type FilterForValues<T, Value> = Exclude<
  ({
    [F in keyof T]: T[F] extends (Value) ? F : never;
  })[keyof T],
  undefined
>;
type JsTypeofString =
  | "undefined"
  | "object"
  | "boolean"
  | "number"
  | "bigint"
  | "string"
  | "symbol"
  | "function";

export type {
  ConvertedGroup,
  ConvertedService,
  ConvertedUser,
  Credentials,
  FilterForValues,
};
export function assertIsStringRecord(
  obj: unknown,
): asserts obj is Record<string, unknown> {
  if (typeof obj !== "object" || obj === null) {
    throw new TypeError("Not an object");
  }
  const objectKeys = Reflect.ownKeys(obj);
  if (!(objectKeys.length > 0)) {
    throw new TypeError("Empty object");
  }
  if (!objectKeys.every((key) => typeof key === "string")) {
    throw new TypeError("All keys must be strings");
  }
}

export function typeCheck<
  T extends JsTypeofString | "array",
>(
  obj: Record<string, unknown>,
  prop: string,
  type: T = "string" as T,
): asserts obj is T extends "array" ? Record<string, []> : Record<string, T> {
  if (obj[prop] === undefined || obj[prop] === null) {
    throw new MissingDataError(`Missing property: ${prop}`);
  } else if (
    (typeof obj[prop]) !== type
  ) {
    if (type === "array") {
      if (Array.isArray(obj[prop])) {
        return;
      }
    }
    throw new TypeError(
      `${prop} is not a ${type}}`,
    );
  }
}

export function checkForAdditionalKeys(obj: object, allKeys: string[]) {
  if (!Object.keys(obj).every((e) => allKeys.some((f) => e === f))) {
    throw new FormlessError();
  }
}

export function indepthTypeCheck(
  assertion: string | string[],
  stringKeys: string[],
  obj: Record<string, unknown>,
  stringArrayKeys: string[],
) {
  if (typeof assertion === "string") {
    if (stringKeys.some((e) => e === assertion)) typeCheck(obj, assertion);
    if (stringArrayKeys.some((e) => e === assertion)) {
      typeCheck(obj, assertion, "array");
      obj[assertion].forEach((e) => {
        if (typeof e !== "string") {
          throw new TypeError(`${obj}:${assertion}:${e} is not a string`);
        }
      });
    }
  } else if (Array.isArray(assertion)) {
    assertion.filter((e) => stringKeys.some((f) => e === f)).forEach((e) =>
      typeCheck(obj, e)
    );
    assertion.filter((e) => stringArrayKeys.some((f) => e === f)).forEach(
      (e) => {
        typeCheck(obj, e, "array");
        obj[e].forEach((f) => {
          if (typeof f !== "string") {
            throw new TypeError(`${obj}:${e}:${f} is not a string`);
          }
        });
      },
    );
  }
}
