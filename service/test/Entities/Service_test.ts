import { assertArrayIncludes, assertEquals, assertFalse } from "@std/assert";
import { Service } from "../../src/classes/Service.ts";
import { ServiceCredential } from "../../src/classes/ServiceCredential.ts";
import { FakeObjectGen } from "../../src/FakeObjectGen.ts";
import { Invitation } from "../../src/classes/Invitation.ts";
import { Group } from "../../src/classes/Group.ts";

const serviceCredential = new ServiceCredential("", "");
const userShort = await FakeObjectGen.createFakeUser(
  undefined,
  undefined,
  "uwe",
);
const user2Short = await FakeObjectGen.createFakeUser(
  undefined,
  undefined,
  "swe",
);
const user = await FakeObjectGen.createFakeUser();
const user2 = await FakeObjectGen.createFakeUser();
const service = Service.createService(serviceCredential, "sag", "", userShort);
Deno.test("Service Class", async (t) => {
  await t.step("Service Creates with correct Owner", () => {
    const owners: string[] = service.listAllowedUsers(true);
    assertArrayIncludes(owners, [userShort.getDisplayName()]);
  });

  await t.step("lists that should be empty are empty", () => {
    assertEquals(
      service.listAllowedGroups().length +
        service.listAllowedUsers().length - 1,
      0,
    );
  });

  await t.step(
    "Service Authorize new User successfully puts User into owners",
    () => {
      service.giveAuthorizationToUser(user2Short);
      assertArrayIncludes(service.listAllowedUsers(), [
        user2Short.getDisplayName(),
      ]);
    },
  );
  await t.step("send invitation", () => {
    const testInvite = new Invitation(
      user.convertToShort(),
      service.convertToShort(),
      user2.convertToShort(),
    );
    service.sendInvitation(user2 as unknown as Group, user);
    assertFalse(!service.sentInvitations.some((e) => e.equals(testInvite)));
  });
});
