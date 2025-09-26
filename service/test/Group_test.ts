import { assertArrayIncludes, assertEquals } from "@std/assert";
import { Group } from "../src/classes/Group.ts";
import { User } from "../src/classes/User.ts";
import { UserCredential } from "../src/classes/UserCredential.ts";
import { Invitation } from "../src/classes/Invitation.ts";

const userCredential = new UserCredential("Hans Meiser", "abcdef");
const user = "asddh";

function createTestGroup(): Group {
  return Group.createUserGroup("Schachverein", user);
}
Deno.test("Group Class", async (t) => {
  await t.step("test the method createUserGroup", () => {
    const group = createTestGroup();
    const owner = group.getOwner();
    assertEquals(owner, user);
  });

  await t.step("test the method getDisplayName on groupname", () => {
    const group = createTestGroup();
    const groupname = group.getDisplayName();
    assertEquals(groupname, "Schachverein");
    console.log(
      "The groupname is " + groupname +
        " and should be hopefully Schachverein!?",
    );
  });

  await t.step("test the method getDisplayName on owner", () => {
    const _group = createTestGroup();

    const owner = userCredential.username;
    console.log(
      "The owner is " + owner + " and should be hopefully Hans Meiser!?",
    );
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
    console.log(
      "The lenght of the List is ",
      length,
      " and should be 0, right?",
    );
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
      const testInvitation: Invitation<Group, User> = new Invitation(
        user,
        group,
        testReceiver,
      );
      //const sender = group.getOwner();
      group.listSentInvitation(testReceiver);

      const listSentInvitation = group.listSentInvitation();
      const listUserGroupInvitation = testReceiver.listUserGroupInvitation();

      assertArrayIncludes(listSentInvitation, [testInvitation]);
      assertArrayIncludes(listUserGroupInvitation, [testInvitation]);
    },
  );
});
