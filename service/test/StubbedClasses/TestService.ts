import { Stubbed, StubFullType } from "@stubClass";
import { Service } from "../../src/classes/Entities/Service.ts";
import { ServiceCredential } from "../../src/classes/Values/ServiceCredential.ts";

export class TestService extends StubFullType<Service> {
  credentials: ServiceCredential;
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
    this.credentials = ServiceCredential.fromString(
      "serviceTestName:serviceTestPassword",
    );
  }
  static create(): Stubbed<Service> {
    return new TestService();
  }
}
