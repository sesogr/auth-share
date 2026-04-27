import { Stubbed, StubFullType } from "@stubClass";
import { User } from "../../src/classes/Entities/User.ts";
import { ValidatedUser } from "../../interfaceTypes/ValidatedUser.ts";

export class TestUser extends StubFullType<User> {
  static create(): Stubbed<User> & {
    _credentials: TestCredentials;
    validated: ValidatedUser;
  } {
    return new TestUser();
  }
  get validated(): ValidatedUser {
    return this as unknown as ValidatedUser;
  }
  readonly _credentials: TestCredentials;
  private constructor() {
    super([
      "listJoinedGroups",
      "getId",
      "getDisplayName",
      "deleteSessionByToken",
      "deleteSession",
      "createSession",
      "convertToShort",
      "checkValidation",
      "changeUserCredentials",
      "validateSession",
      "toJsonString",
      "setDisplayName",
      "toJson",
      "listUserGroupInvitation",
      "listServices",
      "getCredentials",
    ]);
    this.overwriteMethod("getCredentials", () => this._credentials);
    this._credentials = TestCredentials.create();
  }
  override reset(trueReset: boolean = false) {
    this._credentials.reset(trueReset);
    super.reset(trueReset);
  }
}

class TestCredentials extends StubFullType<User["credentials"]> {
  private constructor() {
    super([
      "changePassword",
      "verifyPasswordHash",
      "copy",
      "equals",
      "with",
      "assertsVerification",
      "toString",
    ]);
  }

  static create() {
    return new TestCredentials();
  }
}
