import { Stubbed, StubFullType } from "@stubClass";
import { Group, OwnedGroups } from "../../src/classes/Entities/Group.ts";

export class TestGroup extends StubFullType<Group> {
  private constructor() {
    super([
      "getId",
      "sendMultipleInvitations",
      "listServiceInvitation",
      "listSentInvitation",
      "getOwner",
      "convertToShort",
      "sendInvitation",
      "listAllowedUsers",
      "giveAuthorizationToUser",
      "checkOwner",
      "acceptInvitation",
      "toJsonString",
      "toJson",
      "getDisplayName",
    ]);
  }
  static create(): Stubbed<Group> & { owned: OwnedGroups } {
    return new TestGroup();
  }
  get owned() {
    return this as unknown as OwnedGroups;
  }
}
