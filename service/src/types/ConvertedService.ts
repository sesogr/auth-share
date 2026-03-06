import { MissingDataError } from "../errors/controllerErrors/MissingDataError.ts";
import { assertIsCredentials, Credentials } from "./Credentials.ts";
import { assertIsStringRecord } from "./types.ts";
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
): asserts obj is
  & ConvertedService
  & {
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
      throw new MissingDataError(`Missing property: ${assertion}`);
    }
  } else if (Array.isArray(assertion)) {
    for (const prop of assertion) {
      if (
        obj[prop] === undefined ||
        obj[prop] === null
      ) {
        throw new MissingDataError(`Missing property: ${prop}`);
      }
    }
  }

  if (!assertion) {
    const requiredProperties: (keyof ConvertedService)[] = [
      "id",
      "credentials",
      "serviceName",
      "serviceUrl",
      "users",
      "owners",
      "groups",
      "sentInvitations",
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
        throw new MissingDataError(`Missing property: ${prop}`);
      }
    }
  }
}

export { ensureConvertedServiceIntegrity };
