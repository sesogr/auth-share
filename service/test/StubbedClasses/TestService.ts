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
    this.initializeStub("convertToShort");
    this.initializeStub("getDisplayName");
    this.initializeStub("listAllowedGroups");
    this.initializeStub("toJsonString");
  }
  acceptInvitation(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  giveAuthorizationToGroup(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  checkOwner(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  getDisplayName(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  promoteUser(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  listAllowedUsers(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  listAllowedGroups(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  giveAuthorizationToUser(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  toJsonString(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  toJson(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  sendInvitation(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  getId(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  convertToShort(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  static override create<T = Service>(): T & TestService {
    return new TestService() as T & TestService;
  }
}
