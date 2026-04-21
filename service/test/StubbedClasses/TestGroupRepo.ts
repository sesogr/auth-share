import { StubFullType } from "@stubClass";
import { GroupRepository } from "../../interfaceTypes/GroupRepository.ts";

export class TestGroupRepo extends StubFullType<GroupRepository> {
  private constructor() {
    super([
      "findById",
      "delete",
      "removeById",
      "save",
      "findOwnedByUserId",
      "add",
      "findAll",
      "findByDisplayName",
    ]);
  }
  static create() {
    return new TestGroupRepo();
  }
}
