import { StubFullType } from "@stubClass";
import type { User } from "../../src/classes/Entities/User.ts";

export class TestUser extends StubFullType<User> {
  static override create<T = User>(): T & TestUser {
    return new TestUser() as T & TestUser;
  }
  readonly _credentials: TestCredentials;
  private constructor() {
    super();
    this._credentials = TestCredentials.create();
    this.initializeStub("getId");
    this.initializeStub("getDisplayName");
    this.initializeStub("toJsonString");
    this.initializeStub("toJson");
    this.initializeStub("convertToShort");
    this.initializeStub("validateSession");
    this.initializeStub("getCredentials", () => this._credentials);
    this.initializeStub("changeUserCredentials");
    this.initializeStub("deleteSession");
    this.initializeStub("deleteSessionByToken");
    this.initializeStub("listServices");
    this.initializeStub("listJoinedGroups");
    this.initializeStub("createSession");
    this.initializeStub("removeInvitation");
    this.initializeStub("listUserGroupInvitation");
    this.initializeStub("setDisplayName");
    this.initializeStub("checkValidation");
  }
  override reset(trueReset: boolean = false) {
    this._credentials.reset(trueReset);
    super.reset(trueReset);
  }
}

class TestCredentials extends StubFullType<User["credentials"]> {
  private constructor() {
    super();
    this.initializeStub("copy");
    this.initializeStub("equals");
    this.initializeStub("toString");
    this.initializeStub("with");
    this.initializeStub("verifyPasswordHash");
    this.initializeStub("changePassword");
    this.initializeStub("assertsVerification");
  }
  static override create<T = User["credentials"]>(): T & TestCredentials {
    return new TestCredentials() as T & TestCredentials;
  }
}
