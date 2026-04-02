import { assertIsCredentials, Credentials } from "./Credentials.ts";
import {
  assertIsStringRecord,
  checkForAdditionalKeys,
  FilterForValues,
  indepthTypeCheck,
  typeCheck,
} from "./types.ts";
import { MissingDataError } from "../classes/errors/controllerErrors/MissingDataError.ts";

export type ConvertedService =
  & {
    id?: string;
    credentials?: Credentials;
    serviceName?: string;
    serviceUrl?: string;
  }
  & {
    [K in ServiceListProperties]?: string[];
  };

type ServiceListProperties = "users" | "owners" | "groups" | "sentInvitations";

function ensureConvertedServiceIntegrity<
  K extends Exclude<keyof ConvertedService, "credentials"> = never,
>(
  obj: unknown,
  assertion: K[] | K,
): asserts obj is {
  [P in K]-?: Exclude<ConvertedService[P], undefined>;
};
function ensureConvertedServiceIntegrity<
  K extends keyof ConvertedService = never,
>(
  obj: unknown,
  assertion: K[] | K,
): asserts obj is
  & {
    [P in K]-?: Exclude<ConvertedService[P], undefined>;
  }
  & {
    credentials: {
      [I in keyof Credentials]-?: Exclude<
        Credentials[I],
        undefined
      >;
    };
  };
function ensureConvertedServiceIntegrity(
  obj: unknown,
): asserts obj is
  & {
    credentials: {
      [I in keyof Credentials]-?: Exclude<
        Credentials[I],
        undefined
      >;
    };
  }
  & {
    [P in keyof ConvertedService]-?: Exclude<ConvertedService[P], undefined>;
  };
function ensureConvertedServiceIntegrity(
  obj: unknown,
  assertion?: keyof ConvertedService | (keyof ConvertedService)[],
) {
  const stringKeys: FilterForValues<ConvertedService, (string | undefined)>[] =
    ["id", "serviceName", "serviceUrl"];
  const stringArrayKeys: FilterForValues<
    ConvertedService,
    (string[] | undefined)
  >[] = ["groups", "owners", "sentInvitations", "users"];
  const allKeys: (keyof ConvertedService)[] = [
    ...stringKeys,
    ...stringArrayKeys,
    "credentials",
  ];
  assertIsStringRecord(obj);
  checkForAdditionalKeys(obj, allKeys);
  if (assertion === "credentials") {
    assertIsCredentials(obj["credentials"]);
  }
  if (Array.isArray(assertion)) {
    if (assertion.some((a) => a === "credentials")) {
      if (obj["credentials"] === undefined) {
        throw new MissingDataError("Missing property: credentials");
      }
      assertIsCredentials(obj["credentials"]);
    }
  }
  if (assertion) indepthTypeCheck(assertion, stringKeys, obj, stringArrayKeys);
  else {
    if (obj["credentials"] === undefined) {
      throw new MissingDataError("Missing property: credentials");
    }
    assertIsCredentials(obj["credentials"]);
    for (const prop of stringKeys) {
      typeCheck(obj, prop);
    }
    for (const prop of stringArrayKeys) {
      typeCheck<[]>(obj, prop, "object", true);
      obj[prop].forEach((e) => {
        if (typeof e !== "string") {
          throw new TypeError(`${obj}:${prop}:${e} is not a string`);
        }
      });
    }
  }
}

export { ensureConvertedServiceIntegrity };
