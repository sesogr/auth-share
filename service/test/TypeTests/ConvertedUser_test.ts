import { assertThrows } from "@std/assert";
import {
  ConvertedUser,
  ensureConvertedUserIntegrity,
} from "../../src/types/ConvertedUser.ts";

Deno.test("ConvertedUser Type Check", async (t) => {
  const _allKeys: (keyof ConvertedUser)[] = [
    "id",
    "credentials",
    "displayname",
    "groups",
    "owned",
    "ownedGroups",
    "userGroupInvitations",
    "callable",
  ];
  const completeUser: unknown = {
    callable: ["callable 0"],
    id: "id",
    credentials: {
      username: "username",
      password: "password",
    },
    displayname: "displayname",
    groups: ["group 0"],
    owned: ["owned 0"],
    ownedGroups: ["ownedGroups 0"],
    userGroupInvitations: ["userGroupInvitations 0"],
  };
  const idExists: unknown = {
    id: "id",
  };
  const displaynameExists: unknown = {
    displayname: "displayname",
  };
  const wrongKey = { no: "no" };
  await t.step("all keys are needed", () => {
    ensureConvertedUserIntegrity(completeUser, "groups");
    ensureConvertedUserIntegrity(completeUser, "id");
    ensureConvertedUserIntegrity(completeUser, "credentials");
    ensureConvertedUserIntegrity(completeUser, "displayname");
    ensureConvertedUserIntegrity(completeUser, "userGroupInvitations");
    ensureConvertedUserIntegrity(completeUser, "callable");
    ensureConvertedUserIntegrity(completeUser, "owned");
    ensureConvertedUserIntegrity(completeUser, "ownedGroups");
    const _typedUser: AllRequired<ConvertedUser> = completeUser;
    const completeUser2 = completeUser as unknown;
    ensureConvertedUserIntegrity(completeUser2);
    const _typedUser2: AllRequired<ConvertedUser> = completeUser2;
  });
  await t.step("missing key throws errors", () => {
    ensureConvertedUserIntegrity(idExists, "id");
    ensureConvertedUserIntegrity(idExists, ["id"]);
    ensureConvertedUserIntegrity(displaynameExists, "displayname");
    ensureConvertedUserIntegrity(displaynameExists, ["displayname"]);
    assertThrows(() => {
      ensureConvertedUserIntegrity(idExists);
    });
    assertThrows(() => {
      ensureConvertedUserIntegrity(idExists, "displayname");
    });
    assertThrows(() => {
      ensureConvertedUserIntegrity(idExists, ["displayname"]);
    });
    assertThrows(() => {
      ensureConvertedUserIntegrity(displaynameExists, ["id"]);
    });
    assertThrows(() => {
      ensureConvertedUserIntegrity(displaynameExists, "id");
    });
  });
  await t.step("wrong key", () => {
    assertThrows(() => {
      ensureConvertedUserIntegrity(wrongKey);
    });
  });
});

type AllRequired<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>;
};
