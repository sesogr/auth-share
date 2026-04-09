import { assertEquals, assertThrows } from "@std/assert";
import { User } from "../../src/classes/Entities/User.ts";
import { UserCredential } from "../../src/classes/Values/UserCredential.ts";
import { stub } from "@std/testing/mock";
import { Session } from "../../src/classes/Session.ts";
import { AllowedUserServiceMap } from "../../src/classes/Values/AllowedUserServiceMap.ts";
import { Invitation } from "../../src/classes/Values/Invitation.ts";
import { AllowedUserGroupMap } from "../../src/classes/Values/AllowedUserGroupMap.ts";
Deno.test("UserClass", async (t) => {
  const [name, hash, salt, displayname] = ["as", "cd", "jd", "da"];
  const uc = new UserCredential(name, hash, salt);
  stub(Session, "create", () => new Session("asd", new Date(2027, 12), "asd"));
  stub(Session, "fromSessionTokenToSessionId", () => "asd");

  await t.step("creation", async (st) => {
    await st.step("name too long", () => {
      assertThrows(() => {
        User.createUser(
          new UserCredential("", "", ""),
          "i'mwayyyyytoolongandhave$pecialcharactersasmyname",
        );
      });
    });
    const user: User = User.createUser(
      uc,
      displayname,
    );
    await st.step("creation valid", () => {
      assertEquals(user.getCredentials(), uc);
    });
  });
  await t.step("change displayname", async (st) => {
    const user: User = User.createUser(
      new UserCredential("", "", ""),
      displayname,
    );
    await st.step("displayname too long", () => {
      assertThrows(() => {
        user.setDisplayName(
          "i'mwayyyyytoolongandhave$pecialcharactersasmyname",
        );
      });
    });
    await st.step("valid change displayname", () => {
      const newDisplayName = "newDisplayName";
      user.setDisplayName(newDisplayName);
      assertEquals(user.getDisplayName(), newDisplayName);
    });
  });
  await t.step("show all", async (st) => {
    const invitation = { toString: () => "dklfajsd" } as Invitation;
    const userGroupMap = [{
      toString: () => "jdsklfjk",
      getGroupname: "jdsklfjk",
      isOwner: true,
    }, { getGroupname: "jaskdfj" }] as AllowedUserGroupMap[];
    const session = {
      toString: () => "asd",
      id: "asd",
      expiresAt: { getTime: () => Infinity },
    } as Session;
    const userServiceMap = [{
      getServicename: "asdf",
      isOwner: true,
    }, { getServicename: "asdfa" }] as AllowedUserServiceMap[];
    const username = "dfjkdfj";
    const id = "adskj";
    const credentialData = { "username": "abc" } as UserCredential;
    const user: User = new User(
      credentialData,
      username,
      id,
      userServiceMap,
      [invitation],
      userGroupMap,
      [session],
    );

    await st.step("notValidated", () => {
      assertEquals({ displayname: username }, user.toJson());
    });
    user.validateSession("");
    await st.step("validated", () => {
      assertEquals(
        {
          displayname: user.getDisplayName(),
          owned: userServiceMap.filter((e) => e.isOwner).map((e) =>
            e.getServicename
          ),
          userGroupInvitations: [invitation.toString()],
          credentials: credentialData,
          ownedGroups: userGroupMap.filter((e) => e.isOwner).map((e) =>
            e.getGroupname
          ),
          groups: userGroupMap.map((e) => e.getGroupname),
          callable: userServiceMap.map((e) => e.getServicename),
        },
        user.toJson(),
      );
    });
  });
});
