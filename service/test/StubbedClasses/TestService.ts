import { StubFullType } from "@stubClass";
import { Service } from "../../src/classes/Entities/Service.ts";

export class TestService extends StubFullType<Service> {
  private constructor() {
    super([
      "sendInvitation",
      "promoteUser",
      "listAllowedUsers",
      "giveAuthorizationToUser",
      "giveAuthorizationToGroup",
      "listAllowedGroups",
      "checkOwner",
      "acceptInvitation",
      "toJsonString",
      "toJson",
      "getId",
      "getDisplayName",
      "convertToShort",
    ]);
  }
  static create() {
    return new TestService();
  }
}
