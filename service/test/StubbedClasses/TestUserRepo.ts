import { Stubbed, StubFullType } from "@stubClass";
import { UserRepository } from "../../interfaceTypes/UserRepository.ts";
export class TestUserRepo extends StubFullType<UserRepository> {
  private constructor() {
    super([
      "add",
      "findAll",
      "findById",
      "findByDisplayName",
      "findByUserName",
      "delete",
      "findBySessionToken",
      "removeById",
      "save",
    ]);
  }
  static create() {
    return new TestUserRepo() as Stubbed<UserRepository>;
  }
}
