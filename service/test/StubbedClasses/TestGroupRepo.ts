import { FilterAndMapMethodsToUnknown, StubFullType } from "@stubClass";
import { GroupRepository } from "../../interfaceTypes/GroupRepository.ts";

export class TestGroupRepo extends StubFullType<GroupRepository>
  implements FilterAndMapMethodsToUnknown<GroupRepository> {
  private constructor() {
    super();
    this.initializeStub("findById");
    this.initializeStub("findByDisplayName");
    this.initializeStub("findAll");
    this.initializeStub("add");
    this.initializeStub("removeById");
    this.initializeStub("save");
    this.initializeStub("findOwnedByUserId");
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
  findOwnedByUserId(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  delete(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }

  static override create<T = GroupRepository>(): T & TestGroupRepo {
    return new TestGroupRepo() as T & TestGroupRepo;
  }
}
