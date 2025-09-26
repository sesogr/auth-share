import { assertArrayIncludes, assertEquals } from "@std/assert";
import { Service } from "../src/classes/Service.ts";
import { ServiceCredential } from "../src/classes/ServiceCredential.ts";

const serviceCredential = new ServiceCredential("", "");
const user = "Uwe";
const user2 = "Swe";
const service = Service.createService(serviceCredential, "sag", user);
Deno.test("Service Class", async (t) => {
  await t.step("Service Creates with correct Owner", () => {
    const owners: string[] = service.listAuthorizedUsers(true);
    assertArrayIncludes(owners, [user]);
  });

  await t.step("lists that should be empty are empty", () => {
    assertEquals(
      service.listAuthorizedGroups().length +
        service.listAuthorizedUsers().length,
      0,
    );
  });

  await t.step(
    "Service Authorize new User successfully puts User into owners",
    () => {
      service.giveAuthorizationToUser(user2);
      assertArrayIncludes(service.listAuthorizedUsers(), [user2]);
    },
  );
});
