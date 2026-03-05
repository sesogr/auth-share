import { assertIsCredentials, Credentials } from "./Credentials.ts";
import { assertIsStringRecord } from "./types.ts";

export type ConvertedUser =
  & {
    id?: string;
    credentials?: Credentials;
    displayname?: string;
  }
  & {
    [k in UserListProperties]?: string[];
  };

type UserListProperties =
  | "owned"
  | "callable"
  | "groups"
  | "userGroupInvitations"
  | "ownedGroups";
function ensureConvertedUserIntegrity<
  K extends Exclude<keyof ConvertedUser, "credentials"> = never,
>(
  obj: unknown,
  assertion: K[] | K,
): asserts obj is
  & ConvertedUser
  & {
    [P in K]-?: Exclude<ConvertedUser[P], undefined>;
  };
function ensureConvertedUserIntegrity<
  K extends keyof ConvertedUser = never,
>(
  obj: unknown,
  assertion: K[] | K,
): asserts obj is
  & {
    [P in K]-?: Exclude<ConvertedUser[P], undefined>;
  }
  & {
    credentials: {
      [I in keyof Credentials]-?: Exclude<
        Credentials[I],
        undefined
      >;
    };
  };
function ensureConvertedUserIntegrity(
  obj: unknown,
): asserts obj is
  & {
    credentials: {
      [I in keyof Credentials]-?: Exclude<
        ConvertedUser["credentials"],
        undefined
      >;
    };
  }
  & {
    [P in keyof ConvertedUser]-?: Exclude<ConvertedUser[P], undefined>;
  };
function ensureConvertedUserIntegrity(
  obj: unknown,
  assertion?: unknown,
) {
  assertIsStringRecord(obj);
  if (assertion === "credentials") {
    assertIsCredentials(obj["credentials"]);
  }
  if (Array.isArray(assertion)) {
    if (assertion.some((a) => a === "credentials")) {
      assertIsCredentials(obj["credentials"]);
    }
  }
  if (assertion && typeof assertion === "string") {
    if (
      obj[assertion] === undefined ||
      obj[assertion] === null
    ) {
      throw new TypeError(`Missing property: ${assertion}`);
    }
  } else if (Array.isArray(assertion)) {
    for (const prop of assertion) {
      if (
        obj[prop] === undefined ||
        obj[prop] === null
      ) {
        throw new TypeError(`Missing property: ${prop}`);
      }
    }
  }

  if (!assertion) {
    const requiredProperties: (keyof ConvertedUser)[] = [
      "id",
      "credentials",
      "displayname",
      "owned",
      "callable",
      "groups",
      "userGroupInvitations",
      "ownedGroups",
    ];
    for (const prop of requiredProperties) {
      if (prop === "credentials") {
        assertIsCredentials(obj["credentials"]);
        continue;
      }
      if (
        obj[prop] === undefined ||
        obj[prop] === null
      ) {
        throw new TypeError(`Missing property: ${prop}`);
      }
    }
  }
}

export { ensureConvertedUserIntegrity };
