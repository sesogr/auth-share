import { CustomTestStub } from "../CustomTestStub.ts";
import { GroupRepository } from "../../interfaceTypes/GroupRepository.ts";
import { ClassMethodsOnlyShape } from "../ClassMethodsOnlyShape.ts";

export class TestGroupRepo extends CustomTestStub<GroupRepository>
  implements ClassMethodsOnlyShape<GroupRepository> {
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
  findById(...args: unknown[]): unknown {
    return this.fakeProcess(args, "findById");
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

  save(...args: unknown[]): unknown {
    return this.fakeProcess(args, "save");
  }

  findOwnedByUserId(...args: unknown[]): unknown {
    return this.fakeProcess(args, "findOwnedByUserId");
  }

  delete(...args: unknown[]): unknown {
    return this.fakeProcess(args, "delete");
  }
  static override create<T = GroupRepository>(): T & TestGroupRepo {
    return new TestGroupRepo() as T & TestGroupRepo;
  }
}
