import { CustomTestStub } from "../CustomTestStub.ts";
import { Service } from "../../src/classes/Entities/Service.ts";
import { ClassMethodsOnlyShape } from "../ClassMethodsOnlyShape.ts";

export class TestService extends CustomTestStub<Service>
  implements ClassMethodsOnlyShape<Service> {
  private constructor() {
    super();
    this.initializeStub("acceptInvitation");
    this.initializeStub("giveAuthorizationToGroup");
    this.initializeStub("checkOwner");
    this.initializeStub("promoteUser");
    this.initializeStub("listAllowedUsers");
    this.initializeStub("giveAuthorizationToUser");
    this.initializeStub("sendInvitation");
    this.initializeStub("getDisplayName");
    this.initializeStub("listAllowedGroups");
    this.initializeStub("toJsonString");
  }
  static override create<T = Service>(): T & TestService {
    return new TestService() as T & TestService;
  }
  acceptInvitation(...args: unknown[]): unknown {
    return this.fakeProcess(args, "acceptInvitation");
  }
  giveAuthorizationToGroup(...args: unknown[]): unknown {
    return this.fakeProcess(args, "giveAuthorizationToGroup");
  }
  checkOwner(...args: unknown[]): unknown {
    return this.fakeProcess(args, "checkOwner");
  }
  promoteUser(...args: unknown[]): unknown {
    return this.fakeProcess(args, "promoteUser");
  }
  listAllowedUsers(...args: unknown[]): unknown {
    return this.fakeProcess(args, "listAllowedUsers");
  }
  giveAuthorizationToUser(...args: unknown[]): unknown {
    return this.fakeProcess(args, "giveAuthorizationToUser");
  }
  sendInvitation(...args: unknown[]): unknown {
    return this.fakeProcess(args, "sendInvitation");
  }
  getDisplayName(...args: unknown[]): unknown {
    return this.fakeProcess(args, "getDisplayName");
  }
  listAllowedGroups(...args: unknown[]): unknown {
    return this.fakeProcess(args, "listAllowedGroups");
  }
  toJsonString(...args: unknown[]): unknown {
    return this.fakeProcess(args, "toJsonString");
  }
  toJson(...args: unknown[]): unknown {
    return this.fakeProcess(args, "toJson");
  }
  getId(...args: unknown[]): unknown {
    return this.fakeProcess(args, "getId");
  }
  convertToShort(...args: unknown[]): unknown {
    return this.fakeProcess(args, "convertToShort");
  }
}
