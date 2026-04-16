import { CustomTestStub } from "../CustomTestStub.ts";
import { Group } from "../../src/classes/Entities/Group.ts";

export class TestGroup extends CustomTestStub<Group> {
  private constructor() {
    super();
    this.initializeStub("getId");
    this.initializeStub("getDisplayName");
    this.initializeStub("toJsonString");
    this.initializeStub("toJson");
    this.initializeStub("convertToShort");
    this.initializeStub("giveAuthorizationToUser");
    this.initializeStub("listAllowedUsers");
    this.initializeStub("sendInvitation");
    this.initializeStub("acceptInvitation");
    this.initializeStub("listSentInvitation");
    this.initializeStub("listServiceInvitation");
    this.initializeStub("sendMultipleInvitations");
    this.initializeStub("checkOwner");
  }
  static override create<T = Group>(): T & TestGroup {
    return new TestGroup() as T & TestGroup;
  }
}
