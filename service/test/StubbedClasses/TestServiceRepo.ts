import { CustomTestStub } from "../CustomTestStub.ts";
import { ServiceRepository } from "../../interfaceTypes/ServiceRepository.ts";

export class TestServiceRepo extends CustomTestStub<ServiceRepository> {
  private constructor() {
    super();
    this.initializeStub("findOwnedByUserId");
    this.initializeStub("findById");
    this.initializeStub("save");
    this.initializeStub("findByDisplayName");
    this.initializeStub("findAll");
    this.initializeStub("add");
    this.initializeStub("removeById");
    this.initializeStub("delete");
    this.initializeStub("findAuthorizedForId");
  }
  static override create<T = ServiceRepository>(): T & TestServiceRepo {
    return new TestServiceRepo() as T & TestServiceRepo;
  }
}
