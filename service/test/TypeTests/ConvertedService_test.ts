import { assertThrows } from "@std/assert";
import {
  ConvertedService,
  ensureConvertedServiceIntegrity,
} from "../../src/types/ConvertedService.ts";
import { expectType } from "../../interfaceTypes/expectType.ts";
import { AllRequired } from "./AllRequired.ts";

Deno.test("ConvertedService Type Check", async (t) => {
  const allKeys: (keyof ConvertedService)[] = [
    "id",
    "credentials",
    "sentInvitations",
    "groups",
    "owners",
    "serviceName",
    "users",
    "serviceUrl",
  ] as const;
  const completeService: {
    [k in typeof allKeys[number]]: undefined | unknown;
  } = {
    id: "id",
    credentials: {
      username: "username",
      password: "password",
    },
    serviceName: "servicename",
    serviceUrl: "serviceUrl",
    owners: ["owner 0"],
    users: ["user 0"],
    groups: ["group 0"],
    sentInvitations: ["invitation 0"],
  };
  const idExists: ConvertedService = {
    id: "id",
  };
  const serviceNameExists: ConvertedService = {
    serviceName: "displayname",
  };
  const wrongKey = { no: "no" };
  await t.step("all keys are needed", () => {
    ensureConvertedServiceIntegrity(completeService, "id");
    ensureConvertedServiceIntegrity(completeService, "credentials");
    ensureConvertedServiceIntegrity(completeService, "serviceName");
    ensureConvertedServiceIntegrity(completeService, "serviceUrl");
    ensureConvertedServiceIntegrity(completeService, "owners");
    ensureConvertedServiceIntegrity(completeService, "users");
    ensureConvertedServiceIntegrity(completeService, "groups");
    ensureConvertedServiceIntegrity(completeService, "sentInvitations");
    expectType<AllRequired<ConvertedService>>(completeService);
    const completeService2 = completeService as unknown;
    ensureConvertedServiceIntegrity(completeService2);
    expectType<AllRequired<ConvertedService>>(completeService2);
  });
  await t.step("missing key throws errors", () => {
    ensureConvertedServiceIntegrity(idExists, "id");
    ensureConvertedServiceIntegrity(idExists, ["id"]);
    ensureConvertedServiceIntegrity(serviceNameExists, "serviceName");
    ensureConvertedServiceIntegrity(serviceNameExists, ["serviceName"]);
    assertThrows(() => {
      ensureConvertedServiceIntegrity(idExists);
    });
    assertThrows(() => {
      ensureConvertedServiceIntegrity(idExists, "serviceName");
    });
    assertThrows(() => {
      ensureConvertedServiceIntegrity(idExists, ["serviceName"]);
    });
    assertThrows(() => {
      ensureConvertedServiceIntegrity(idExists, "credentials");
    });
    assertThrows(() => {
      ensureConvertedServiceIntegrity(idExists, ["credentials"]);
    });
    assertThrows(() => {
      ensureConvertedServiceIntegrity(serviceNameExists, ["id"]);
    });
    assertThrows(() => {
      ensureConvertedServiceIntegrity(serviceNameExists);
    });
    assertThrows(() => {
      ensureConvertedServiceIntegrity(serviceNameExists, "id");
    });
  });
  await t.step("wrong key", () => {
    assertThrows(() => {
      ensureConvertedServiceIntegrity(wrongKey);
    });
  });
  await t.step("wrong type", () => {
    const test = completeService;
    test.users = 123;
    test.owners = [123, 123];
    assertThrows(
      () => {
        ensureConvertedServiceIntegrity(test, "users");
      },
      TypeError,
      "array",
    );
    assertThrows(
      () => {
        ensureConvertedServiceIntegrity(test, "owners");
      },
      TypeError,
      "string",
    );
    assertThrows(
      () => {
        ensureConvertedServiceIntegrity(test);
      },
      TypeError,
      "string",
    );
  });
});
