import { CustomTestStub } from "../CustomTestStub.ts";
import { GroupRepository } from "../../interfaceTypes/GroupRepository.ts";

export class TestGroupRepo extends CustomTestStub<GroupRepository> {
  private constructor() {
    super();
  }
  static override create<T = GroupRepository>(): T & TestGroupRepo {
    return new TestGroupRepo() as T & TestGroupRepo;
  }
}
