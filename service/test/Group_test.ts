import { assertArrayIncludes, assertEquals, assertFalse } from "@std/assert";
import { Group } from "../src/classes/Group.ts";
import { User } from "../src/classes/User.ts";
import { UserCredential } from "../src/classes/UserCredential.ts";
import { Invitation } from "../src/classes/Invitation.ts";
import { FakeObjectGen } from "../src/FakeObjectGen.ts";

const userCredential = new UserCredential("Hans Meiser", "abcdef");

const user = FakeObjectGen.createFakeUser("asddh", "hallo");
function createTestGroup(): Group {
  return Group.createUserGroup("Schachverein", user);
}
Deno.test("Group Class", async (t) => {
  await t.step("test the method createUserGroup", () => {
    const group = createTestGroup();
    const owner = group.getOwner();
    assertEquals(owner, user.convertToShort());
  });

  await t.step("test the method getDisplayName on groupname", () => {
    const group = createTestGroup();
    const groupname = group.getDisplayName();
    assertEquals(groupname, "Schachverein");
  });

  await t.step("test the method getDisplayName on owner", () => {
    const _group = createTestGroup();

    const owner = userCredential.username;
    assertEquals(owner, "Hans Meiser");
  });

  await t.step("test whether the list serviceInvitations is empty", () => {
    const group = createTestGroup();
    const list = group.listServiceInvitation();
    assertArrayIncludes(list, list);
  });

  await t.step("test2 whether the list serviceInvitations is empty", () => {
    const group = createTestGroup();
    const list = group.listServiceInvitation();

    const length = list.length;
    assertEquals(length, 0);
  });

  await t.step(
    "test2 for method sendInvitation with a testInvitation - will the invitation put correctly in the lists?",
    () => {
      const group: Group = createTestGroup();
      const testUserCredentials: UserCredential = new UserCredential(
        "Don Receiver",
        "qwertz",
      );
      const testReceiver: User = User.createUser(
        testUserCredentials,
        "Don Receiver",
      );
      const user = new User(testUserCredentials, "asd");
      const testInvitation: Invitation = new Invitation(
        user.convertToShort(),
        group.convertToShort(),
        testReceiver.convertToShort(),
      );
      group.listSentInvitation();
      group.sendInvitation(
        user,
        testReceiver,
      );
      const listSentInvitation = group.listSentInvitation();
      console.log(testInvitation.senderReference.displayname);
      assertFalse(!listSentInvitation.some((e) => e.equals(testInvitation)));
    },
  );
});
