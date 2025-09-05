import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Group } from "../src/classes/Group.ts";
import { User } from "../src/classes/User.ts";
import { UserCredential } from "../src/classes/UserCredential.ts";
import { assertArrayIncludes } from "https://deno.land/std@0.224.0/assert/assert_array_includes.ts";
import { Invitation } from "../src/classes/Invitation.ts";

const userCredential = new UserCredential("Hans Meiser", "abcdef");
const user = User.createUser(userCredential, "");

function createTestGroup(): Group {
  return Group.createUserGroup("Schachverein", user);
}

Deno.test("test the method createUserGroup", () => {
  const group = createTestGroup();
  const owner = group.getOwner();
  assertEquals(owner, user);
  assertArrayIncludes(owner.listOwnedGroups(), [group]);
});

Deno.test("test the method getDisplayName on groupname", () => {
  const group = createTestGroup();
  const groupname = group.getDisplayName();
  assertEquals(groupname, "Schachverein");
  console.log(
    "The groupname is " + groupname + " and should be hopefully Schachverein!?"
  );
});

Deno.test("test the method getDisplayName on owner", () => {
  const group = createTestGroup();

  const owner = userCredential.username;
  console.log(
    "The owner is " + owner + " and should be hopefully Hans Meiser!?"
  );
  assertEquals(owner, "Hans Meiser");
});

Deno.test("test whether the list serviceInvitations is empty", () => {
  const group = createTestGroup();
  const list = group.listServiceInvitation();
  assertArrayIncludes(list, list);
});

Deno.test("test2 whether the list serviceInvitations is empty", () => {
  const group = createTestGroup();
  const list = group.listServiceInvitation();

  const length = list.length;
  console.log("The lenght of the List is ", length, " and should be 0, right?");
  assertEquals(length, 0);
});

Deno.test(
  "test for method sendInvitation - will the invitation put correctly in the lists?",
  () => {
    const group = createTestGroup();
    const testReciever = new UserCredential("Don Receiver", "qwertz");
    const testUser = User.createUser(testReciever, "Don Receiver");
    //const sender = group.getOwner();
    group.sendInvitation(testUser);

    const listSentInvitation = group.listSentInvitation();
    assertEquals(listSentInvitation, testUser.listUserGroupInvitation());
  }
);

Deno.test(
  "test2 for method sendInvitation with a testInvitation - will the invitation put correctly in the lists?",
  () => {
    const group: Group = createTestGroup();
    const testUserCredentials: UserCredential = new UserCredential(
      "Don Receiver",
      "qwertz"
    );
    const testReceiver: User = User.createUser(
      testUserCredentials,
      "Don Receiver"
    );
    const testInvitation: Invitation<Group, User> = new Invitation(
      user,
      group,
      testReceiver
    );
    //const sender = group.getOwner();
    group.sendInvitation(testReceiver);

    const listSentInvitation = group.listSentInvitation();
    const listUserGroupInvitation = testReceiver.listUserGroupInvitation();

    assertArrayIncludes(listSentInvitation, [testInvitation]);
    assertArrayIncludes(listUserGroupInvitation, [testInvitation]);
  }
);

export const groupTestDefinition = async (t: Deno.TestContext) => {
  await t.step("test the method createUserGroup", () => {
    const group = createTestGroup();
    const owner = group.getOwner();
    assertEquals(owner, user);
    assertArrayIncludes(owner.listOwnedGroups(), [group]);
  });

  await t.step("test the method getDisplayName on groupname", () => {
    const group = createTestGroup();
    const groupname = group.getDisplayName();
    assertEquals(groupname, "Schachverein");
    console.log(
      "The groupname is " +
        groupname +
        " and should be hopefully Schachverein!?"
    );
  });

  await t.step("test the method getDisplayName on owner", () => {
    const group = createTestGroup();

    const owner = userCredential.username;
    console.log(
      "The owner is " + owner + " and should be hopefully Hans Meiser!?"
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
      " and should be 0, right?"
    );
    assertEquals(length, 0);
  });

  await t.step(
    "test for method sendInvitation - will the invitation put correctly in the lists?",
    () => {
      const group = createTestGroup();
      const testReciever = new UserCredential("Don Receiver", "qwertz");
      const testUser = User.createUser(testReciever, "Don Receiver");
      //const sender = group.getOwner();
      group.sendInvitation(testUser);

      const listSentInvitation = group.listSentInvitation();
      assertEquals(listSentInvitation, testUser.listUserGroupInvitation());
    }
  );

  await t.step(
    "test2 for method sendInvitation with a testInvitation - will the invitation put correctly in the lists?",
    () => {
      const group: Group = createTestGroup();
      const testUserCredentials: UserCredential = new UserCredential(
        "Don Receiver",
        "qwertz"
      );
      const testReceiver: User = User.createUser(
        testUserCredentials,
        "Don Receiver"
      );
      const testInvitation: Invitation<Group, User> = new Invitation(
        user,
        group,
        testReceiver
      );
      //const sender = group.getOwner();
      group.sendInvitation(testReceiver);

      const listSentInvitation = group.listSentInvitation();
      const listUserGroupInvitation = testReceiver.listUserGroupInvitation();

      assertArrayIncludes(listSentInvitation, [testInvitation]);
      assertArrayIncludes(listUserGroupInvitation, [testInvitation]);
    }
  );
};
