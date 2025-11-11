import { assertArrayIncludes, assertEquals, assertFalse } from "@std/assert";
import { Service } from "../src/classes/Service.ts";
import { ServiceCredential } from "../src/classes/ServiceCredential.ts";
import { FakeObjectGen } from "../src/FakeObjectGen.ts";
import { Invitation } from "../src/classes/Invitation.ts";
import { ShortEntity } from "../src/interfaceTypes/ShortEntity.ts";
import { IdNameMap } from "../src/classes/IdNameMap.ts";

const serviceCredential = new ServiceCredential("", "");
const userShort: ShortEntity = new IdNameMap("", "uwe");
const user2Short: ShortEntity = new IdNameMap("", "Swe");
const user = FakeObjectGen.createFakeUser();
const user2 = FakeObjectGen.createFakeUser();
const service = Service.createService(serviceCredential, "sag", "", userShort);
Deno.test("Service Class", async (t) => {
  await t.step("Service Creates with correct Owner", () => {
    const owners: string[] = service.listAllowedUsers(true);
    assertArrayIncludes(owners, [userShort.displayname]);
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
        user2Short.displayname,
      ]);
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
