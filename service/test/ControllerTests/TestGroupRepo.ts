import { CustomTestStub } from "../CustomTestStub.ts";
import { ServiceRepository } from "../../interfaceTypes/ServiceRepository.ts";

export class TestGroupRepo extends CustomTestStub<ServiceRepository> {
  private constructor() {
    super();
  }
  static override create<T = ServiceRepository>(): T & TestGroupRepo {
    return new TestGroupRepo() as T & TestGroupRepo;
  }
}
