import { Stubbed, StubFullType } from "@stubClass";
import { Group } from "../../src/classes/Entities/Group.ts";

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
  static create(): Stubbed<Group> {
    return new TestGroup();
  }
}
