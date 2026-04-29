import { assertArrayIncludes, assertEquals, assertThrows } from "@std/assert";
import { Group } from "../../src/classes/Entities/Group.ts";
import { User } from "../../src/classes/Entities/User.ts";
import { UserCredential } from "../../src/classes/Values/UserCredential.ts";
import { Invitation } from "../../src/classes/Values/Invitation.ts";
import { FakeObjectGen } from "../../src/classes/FakeObjectGen.ts";
import { DuplicateError } from "../../src/classes/errors/DuplicateError.ts";
import { ConvertedGroup } from "../../src/types/types.ts";
import { IdNameMap } from "../../src/classes/Values/IdNameMap.ts";
import { AllowedGroupServiceMap } from "../../src/classes/Values/AllowedGroupServiceMap.ts";
import { AllowedUserGroupMap } from "../../src/classes/Values/AllowedUserGroupMap.ts";
import { TestUser } from "../StubbedClasses/TestUser.ts";

const userCredential = new UserCredential("Hans Meiser", "abcdef", "");

const user = await FakeObjectGen.createFakeUser("asddh", "hallo");
const user2 = await FakeObjectGen.createFakeUser("sad", "sa");

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

  await t.step("AllowedUsers", async (st) => {
    const group = createTestGroup();
    group.giveAuthorizationToUser(user2);
    await st.step("authorization happened", () => {
      assertEquals(group.listAllowedUsers(), [user.getId(), user2.getId()]);
      assertEquals(group.listAllowedUsers(true), [user.getId()]);
    });
    await st.step("give authorizationtouser throws duplicate", () => {
      assertThrows(() => {
        group.giveAuthorizationToUser(user2);
      }, DuplicateError);
    });
  });
  await t.step("test the method getDisplayName on owner", () => {
    assertEquals(userCredential.username, "Hans Meiser");
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
        "",
      );
      const testReceiver: User = User.createUser(
        testUserCredentials,
        "Don Receiver",
      );
      const user = User.createUser(testUserCredentials, "asd");
      //@ts-ignore private property
      group.owner = user.convertToShort();
      const testInvitation: Invitation = new Invitation(
        user.convertToShort(),
        group.convertToShort(),
        testReceiver.convertToShort(),
        "group",
      );
      group.listSentInvitation();
      group.sendInvitation(
        user,
        testReceiver,
      );
      const listSentInvitation = group.listSentInvitation();
      assertEquals([testInvitation], listSentInvitation);
    },
  );
  await t.step("Show All as Owner", () => {
    const group: Group = new Group(
      "abc",
      { displayname: "abc" } as IdNameMap,
      "1ab",
      [{ getServicename: "abc" }] as AllowedGroupServiceMap[],
      [{ toString: () => "abc" }] as Invitation[],
      [{ toString: () => "abc" }] as Invitation[],
      [{ getUsername: "abc" }] as AllowedUserGroupMap[],
    );
    group.checkOwner({
      convertToShort: () => {
        return { equals: () => true };
      },
    } as unknown as User);
    const convGroup: ConvertedGroup = {
      id: group.getId(),
      groupname: group.getDisplayName(),
      owner: group.getOwner().displayname,
      users: group.allowedUser.map((e) => e.getUsername),
      serviceList: group.serviceList.map((e) => e.getServicename),
      sentInvitations: group.sentInvitations.map((e) => e.toString()),
      serviceInvitations: group.listServiceInvitation().map((e) =>
        e.toString()
      ),
    };
    assertEquals(group.toJson(), convGroup);
    assertEquals(group.toJsonString(), JSON.stringify(convGroup));
  });
  await t.step("Show All not Owner", () => {
    const group: Group = new Group(
      "abc",
      { displayname: "abc" } as IdNameMap,
      "1ab",
      [{ getServicename: "abc" }] as AllowedGroupServiceMap[],
      [{ toString: () => "abc" }] as Invitation[],
      [{ toString: () => "abc" }] as Invitation[],
      [{ getUsername: "abc" }] as AllowedUserGroupMap[],
    );
    const convGroup: ConvertedGroup = {
      id: group.getId(),
      groupname: group.getDisplayName(),
      owner: group.getOwner().displayname,
      users: group.allowedUser.map((e) => e.getUsername),
      serviceList: group.serviceList.map((e) => e.getServicename),
    };
    assertEquals(group.toJson(), convGroup);
    assertEquals(group.toJsonString(), JSON.stringify(convGroup));
  });

  await t.step("privileged methods throw when not privileged", () => {
    const group = new Group("asdf", new IdNameMap("id", "name"));
    assertThrows(() => {
      group.giveAuthorizationToUser(user);
    });
    assertThrows(() => {
      group.sendMultipleInvitations(user, [user2]);
    });
    assertThrows(() => {
      group.sendInvitation(user, user2);
    });
    assertThrows(() => {
      group.acceptInvitation({} as Invitation);
    });
    assertThrows(() => {
      group.listSentInvitation();
    });
    assertThrows(() => {
      group.listServiceInvitation();
    });
    assertThrows(() => {
      group.sentInvitations;
    });
  });

  await t.step("accept invitation", async (st) => {
    const group = await FakeObjectGen.createFakeGroup();
    const owner = TestUser.create();
    const ownerObject = group.getOwner();
    await st.step("not found", () => {
      assertThrows(() => {
        group.acceptInvitation({} as Invitation);
      });
    });
    await st.step("found", () => {
      owner.reset();
      owner.registerOutput("convertToShort", ownerObject, true);
      group.sendInvitation(owner.validated, user2);
      const [invite] = group.listSentInvitation();
      group.acceptInvitation(invite);
      assertArrayIncludes(group.listAllowedUsers(), [user2.getId()]);
    });
  });
  await t.step("invite multiple", async (st) => {
    const group = await FakeObjectGen.createFakeGroup();
    const owner = TestUser.create();
    const user3 = await FakeObjectGen.createFakeUser();
    await st.step("2 sended", () => {
      const ownerObject = group.getOwner();
      owner.registerOutput("convertToShort", ownerObject, true);
      group.sendMultipleInvitations(owner.validated, [user2, user3]);
      const [invite1, invite2] = group.listSentInvitation();
      group.acceptInvitation(invite1);
      group.acceptInvitation(invite2);
      assertArrayIncludes(group.listAllowedUsers(), [
        user2.getId(),
        user3.getId(),
      ]);
    });
    await st.step("duplicate sended", () => {
      const returned = group.sendMultipleInvitations(owner.validated, [
        user2,
        user2,
        user3,
        user3,
      ]);
      assertArrayIncludes(returned.alreadyIn, [user2, user3]);
    });
  });
});
