import { CustomTestStub } from "../CustomTestStub.ts";
import { User } from "../../src/classes/Entities/User.ts";

export class TestUser extends CustomTestStub<User> {
  static override create<T = User>(): T & TestUser {
    return new TestUser() as T & TestUser;
  }
  private constructor() {
    super();
    this.initializeStub("getId");
    this.initializeStub("getDisplayName");
    this.initializeStub("toJsonString");
    this.initializeStub("toJson");
    this.initializeStub("convertToShort");
    this.initializeStub("validateSession");
    this.initializeStub("getCredentials");
    this.initializeStub("changeUserCredentials");
    this.initializeStub("deleteSession");
    this.initializeStub("deleteSessionByToken");
    this.initializeStub("listServices");
    this.initializeStub("listJoinedGroups");
    this.initializeStub("createSession");
    this.initializeStub("removeInvitation");
    this.initializeStub("listUserGroupInvitation");
    this.initializeStub("setDisplayName");
  }
}
