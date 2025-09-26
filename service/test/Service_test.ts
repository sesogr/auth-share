import { assertArrayIncludes, assertEquals, assertFalse } from "@std/assert";
import { Service } from "../src/classes/Service.ts";
import { ServiceCredential } from "../src/classes/ServiceCredential.ts";
import { FakeObjectGen } from "../src/FakeObjectGen.ts";
import { Invitation } from "../src/classes/Invitation.ts";

const serviceCredential = new ServiceCredential("", "");
const userId = "Uwe";
const user2Id = "Swe";
const user = FakeObjectGen.createFakeUser();
const user2 = FakeObjectGen.createFakeUser();
const service = Service.createService(serviceCredential, "sag", userId);
Deno.test("Service Class", async (t) => {
  await t.step("Service Creates with correct Owner", () => {
    const owners: string[] = service.listAuthorizedUsers(true);
    assertArrayIncludes(owners, [userId]);
  });

  await t.step("lists that should be empty are empty", () => {
    assertEquals(
      service.listAuthorizedGroups().length +
        service.listAuthorizedUsers().length - 1,
      0,
    );
  });

  await t.step(
    "Service Authorize new User successfully puts User into owners",
    () => {
      service.giveAuthorizationToUser(user2Id);
      assertArrayIncludes(service.listAuthorizedUsers(), [user2Id]);
    },
  );
  await t.step("send invitation", () => {
    const testInvite = new Invitation(
      user.convertToShort(),
      service.convertToShort(),
      user2.convertToShort(),
    );
    service.sendInvitation(user2.convertToShort(), user.convertToShort());
    assertFalse(!service.sentInvitations.some((e) => e.equals(testInvite)));
  });
});
