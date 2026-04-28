import {
  ConvertedGroup,
  ensureConvertedGroupIntegrity,
} from "../../src/types/ConvertedGroup.ts";
import { expectType } from "../../interfaceTypes/expectType.ts";
import { AllRequired } from "./AllRequired.ts";
import { assertThrows } from "@std/assert";

Deno.test("ConvertedGroup", async (t) => {
  const allKeys: (keyof ConvertedGroup)[] = [
    "id",
    "groupname",
    "serviceInvitations",
    "users",
    "serviceList",
    "owner",
    "sentInvitations",
  ] as const;
  const completeGroup: unknown = {
    id: "id",
    groupname: "groupname",
    serviceInvitations: ["invitationService"],
    users: ["user"],
    serviceList: ["service"],
    owner: "owner",
    sentInvitations: ["invitationGroup"],
  };
  const idExists: unknown = {
    id: "id",
  };
  const groupnameExists: unknown = {
    groupname: "displayname",
  };
  const wrongKey = { no: "no" };
  await t.step("all keys are needed", () => {
    ensureConvertedGroupIntegrity(completeGroup, "id");
    ensureConvertedGroupIntegrity(completeGroup, "groupname");
    ensureConvertedGroupIntegrity(completeGroup, "serviceInvitations");
    ensureConvertedGroupIntegrity(completeGroup, "users");
    ensureConvertedGroupIntegrity(completeGroup, "serviceList");
    ensureConvertedGroupIntegrity(completeGroup, "owner");
    ensureConvertedGroupIntegrity(completeGroup, "sentInvitations");
    expectType<AllRequired<ConvertedGroup>>(completeGroup);
    const completeGroup2 = completeGroup as unknown;
    ensureConvertedGroupIntegrity(completeGroup2);
    expectType<AllRequired<ConvertedGroup>>(completeGroup2);
    const completeGroup3 = completeGroup as unknown;
    ensureConvertedGroupIntegrity(completeGroup3, allKeys);
    expectType<AllRequired<ConvertedGroup>>(completeGroup3);
  });
  await t.step("wrong key should throw error", () => {
    assertThrows(
      () => {
        ensureConvertedGroupIntegrity(wrongKey);
      },
    );
  });
  await t.step("missing key should throw error", () => {
    assertThrows(
      () => {
        ensureConvertedGroupIntegrity(idExists, "groupname");
      },
    );
    assertThrows(
      () => {
        ensureConvertedGroupIntegrity(idExists, ["groupname"]);
      },
    );
    assertThrows(
      () => {
        ensureConvertedGroupIntegrity(idExists);
      },
    );
    assertThrows(
      () => {
        ensureConvertedGroupIntegrity(groupnameExists, "id");
      },
    );
    assertThrows(
      () => {
        ensureConvertedGroupIntegrity(groupnameExists, ["id"]);
      },
    );
  });
});
