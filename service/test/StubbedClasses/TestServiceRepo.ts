import { CustomTestStub } from "../CustomTestStub.ts";
import { ServiceRepository } from "../../interfaceTypes/ServiceRepository.ts";
import { ClassMethodsOnlyShape } from "../ClassMethodsOnlyShape.ts";

export class TestServiceRepo extends CustomTestStub<ServiceRepository>
  implements ClassMethodsOnlyShape<ServiceRepository> {
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
  findByDisplayName(...args: unknown[]): unknown {
    return this.fakeProcess(args, "findByDisplayName");
  }
  findAll(...args: unknown[]): unknown {
    return this.fakeProcess(args, "findAll");
  }
  add(...args: unknown[]): unknown {
    return this.fakeProcess(args, "add");
  }
  removeById(...args: unknown[]): unknown {
    return this.fakeProcess(args, "removeById");
  }
  findAuthorizedForId(...args: unknown[]): unknown {
    return this.fakeProcess(args, "findAuthorizedForId");
  }
  delete(...args: unknown[]): unknown {
    return this.fakeProcess(args, "delete");
  }
  findOwnedByUserId(
    ...args: unknown[]
  ) {
    return this.fakeProcess(args, "findOwnedByUserId");
  }
  findById(...args: unknown[]) {
    return this.fakeProcess(args, "findById");
  }
  save(...args: unknown[]) {
    return this.fakeProcess(args, "save");
  }
}
