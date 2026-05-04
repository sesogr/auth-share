import { assertEquals, assertThrows } from "@std/assert";
import { User } from "../../src/classes/Entities/User.ts";
import { UserCredential } from "../../src/classes/Values/UserCredential.ts";
import { stub } from "@std/testing/mock";
import { Session } from "../../src/classes/Session.ts";
import { AllowedUserServiceMap } from "../../src/classes/Values/AllowedUserServiceMap.ts";
import { Invitation } from "../../src/classes/Values/Invitation.ts";
import { AllowedUserGroupMap } from "../../src/classes/Values/AllowedUserGroupMap.ts";
import { ConvertedUser } from "../../src/types/ConvertedUser.ts";
import { expectType } from "../../interfaceTypes/expectType.ts";
import { ValidationError } from "../../src/classes/errors/ValidationError.ts";
import type {
  ValidatedUser,
  ValidatedUserMethods,
} from "../../interfaceTypes/ValidatedUser.ts";
import { SessionError } from "../../src/classes/errors/controllerErrors/SessionError.ts";

Deno.test("UserClass", async (t) => {
  const [name, hash, salt, displayname] = ["as", "cd", "jd", "da"];
  const uc = new UserCredential(name, hash, salt);
  const [userId, sessionToken, sessionId, sessionExpiresDate] = [
    "userId",
    "SessionToken",
    "sessionId",
    new Date(2027, 12),
  ];
  const session = new Session(sessionId, sessionExpiresDate, userId);
  stub(
    Session,
    "create",
    () => {
      return session;
    },
  );
  stub(Session, "fromSessionTokenToSessionId", (token: string) => {
    return token === sessionToken ? sessionId : "error";
  });
  stub(Session, "generateRandomSessionToken", () => sessionToken);
  let nowNumber = Date.now();
  stub(Date, "now", () => nowNumber);
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
      assertEquals(
        user.toJsonString(),
        JSON.stringify({ displayname: username }),
      );
    });
    await st.step("validated", () => {
      //@ts-ignore private
      user.validated = true;
      const userdata: ConvertedUser = {
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
      };
      assertEquals(
        userdata,
        user.toJson(),
      );
      assertEquals(
        JSON.parse(JSON.stringify(userdata)),
        JSON.parse(user.toJsonString()),
      );
      //@ts-ignore private
      user.validated = false;
    });
  });
  await t.step("check Validation", () => {
    let user: User = new User({} as UserCredential);
    assertThrows(() => {
      user.checkValidation();
    }, ValidationError);
    user = User.createUser({} as UserCredential, "abc");
    user.checkValidation();
    expectType<ValidatedUser>(user);
  });
  await t.step("checkValidation gets called for all privileged methods", () => {
    const privilegedMethods: (keyof ValidatedUserMethods)[] = [
      "setDisplayName",
      "changeUserCredentials",
      "listJoinedGroups",
      "listServices",
      "listUserGroupInvitation",
    ];
    const user: User = new User({} as UserCredential, "hello");
    privilegedMethods.forEach((e) => {
      assertThrows(
        () => {
          user[e]("asdf" as never);
        },
        ValidationError,
        "hello is not validated",
      );
    });
    //@ts-ignore private
    user.validated = true;
    privilegedMethods.forEach((e) => {
      user[e]("asdf" as never);
    });
  });
  await t.step("Session management", async (st) => {
    const user: User = new User({} as UserCredential, "username", userId);
    const returned = user.createSession();
    await st.step("creation", () => {
      assertEquals(returned, { token: sessionToken, session });
      user.validateSession(sessionToken);
      assertThrows(
        () => {
          user.validateSession("error");
        },
        SessionError,
        "not found!",
      );
    });
    await st.step("variousValidationBranches", () => {
      nowNumber = sessionExpiresDate.getTime() - 10000;
      user.validateSession(sessionToken);
      assertEquals(
        session.expiresAt.getTime(),
        Date.now() + Session.MAX_DURATION_MS,
      );
      nowNumber = Infinity;
      assertThrows(() => {
        user.validateSession(sessionToken);
      });
      nowNumber = -Infinity;
      user.createSession();
      user.validateSession(sessionToken);
      user.deleteSessionByToken(sessionToken);
      assertThrows(() => {
        user.validateSession(sessionToken);
      });
    });
  });
});
