import { CustomTestStub } from "../CustomTestStub.ts";
import { UserRepository } from "../../interfaceTypes/UserRepository.ts";
import { ClassMethodsOnlyShape } from "../ClassMethodsOnlyShape.ts";

export class TestUserRepo extends CustomTestStub<UserRepository>
  implements ClassMethodsOnlyShape<UserRepository> {
  private constructor() {
    super();
    this.initializeStub("findByDisplayName");
    this.initializeStub("findById");
    this.initializeStub("findAll");
    this.initializeStub("add");
    this.initializeStub("removeById");
    this.initializeStub("save");
    this.initializeStub("findByUserName");
    this.initializeStub("findBySessionToken");
    this.initializeStub("delete");
  }
  static override create<StaticT = UserRepository>(): StaticT & TestUserRepo {
    return new TestUserRepo() as StaticT & TestUserRepo;
  }
  findById(...args: unknown[]): unknown {
    return this.fakeProcess(args, "findById");
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
  save(...args: unknown[]): unknown {
    return this.fakeProcess(args, "save");
  }
  findByUserName(...args: unknown[]): unknown {
    return this.fakeProcess(args, "findByUserName");
  }
  findBySessionToken(...args: unknown[]): unknown {
    return this.fakeProcess(args, "findBySessionToken");
  }
  delete(...args: unknown[]): unknown {
    return this.fakeProcess(args, "delete");
  }
  findByDisplayName(...args: unknown[]) {
    return this.fakeProcess(args, "findByDisplayName");
  }
}
