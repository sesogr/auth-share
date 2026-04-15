import { CustomTestStub } from "../CustomTestStub.ts";
import { ServiceRepository } from "../../interfaceTypes/ServiceRepository.ts";

export class TestServiceRepo extends CustomTestStub<ServiceRepository> {
  private constructor() {
    super();
    this.initializeStub("findOwnedByUserId");
    this.initializeStub("findById");
    this.initializeStub("save");
  }
  static override create<T = ServiceRepository>(): T & TestServiceRepo {
    return new TestServiceRepo() as T & TestServiceRepo;
  }
  findOwnedByUserId(
    ...args: Parameters<ServiceRepository["findOwnedByUserId"]>
  ) {
    return this.fakeProcess(args, "findOwnedByUserId");
  }
  findById(...args: Parameters<ServiceRepository["findById"]>) {
    return this.fakeProcess(args, "findById");
  }
  save(...args: Parameters<ServiceRepository["save"]>) {
    return this.fakeProcess(args, "save");
  }
}
