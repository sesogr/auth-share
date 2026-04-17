import { FilterAndMapMethodsToUnknown, StubFullType } from "@stubClass";
import { UserRepository } from "../../interfaceTypes/UserRepository.ts";

export class TestUserRepo extends StubFullType<UserRepository>
  implements FilterAndMapMethodsToUnknown<UserRepository> {
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
  findById(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  findByDisplayName(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  findAll(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  add(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  removeById(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  save(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  findByUserName(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  findBySessionToken(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  delete(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  static override create<StaticT = UserRepository>(): StaticT & TestUserRepo {
    return new TestUserRepo() as StaticT & TestUserRepo;
  }
}
