import { CustomTestStub } from "../CustomTestStub.ts";
import { UserRepository } from "../../interfaceTypes/UserRepository.ts";

export class TestUserRepo extends CustomTestStub<UserRepository> {
  private constructor() {
    super();
    this.initializeStub("findByDisplayName");
  }
  static override create<StaticT = UserRepository>(): StaticT & TestUserRepo {
    return new TestUserRepo() as StaticT & TestUserRepo;
  }
  findByDisplayName(...args: Parameters<UserRepository["findByDisplayName"]>) {
    return this.fakeProcess(args, "findByDisplayName");
  }
}
