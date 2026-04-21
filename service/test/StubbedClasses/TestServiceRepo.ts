import { StubFullType } from "@stubClass";
import { ServiceRepository } from "../../interfaceTypes/ServiceRepository.ts";

export class TestServiceRepo extends StubFullType<ServiceRepository> {
  private constructor() {
    super([
      "removeById",
      "save",
      "findOwnedByUserId",
      "findAuthorizedForId",
      "add",
      "findAll",
      "findById",
      "findByDisplayName",
      "delete",
    ]);
  }
  static create() {
    return new TestServiceRepo();
  }
}
