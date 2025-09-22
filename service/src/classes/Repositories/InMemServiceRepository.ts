import { FakeObjectGen } from "../../FakeObjectGen.ts";
import { ServiceRepository } from "../../interfaceTypes/ServiceRepository.ts";
import { ConvertedService } from "../../types/ConvertedService.ts";

import { AllowedGroupMap } from "../AllowedGroupMap.ts";
import { AllowedUserServiceMap } from "../AllowedUserServiceMap.ts";

import { Service } from "../Service.ts";
import { ServiceCredential } from "../ServiceCredential.ts";
import { User } from "../User.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

export class InMemServiceRepository extends InMemoryRepository<Service>
  implements ServiceRepository {
  private _allowedUser: AllowedUserServiceMap[] = [];
  public get allowedUser(): AllowedUserServiceMap[] {
    return [...this._allowedUser];
  }
  private _allowedGroups: AllowedGroupMap[] = [];
  public get allowedGroups(): AllowedGroupMap[] {
    return [...this._allowedGroups];
  }
  constructor(user: User) {
    const serviceList: Service[] = [];
    for (let i = 0; i < 10; i++) {
      const fakeService = FakeObjectGen.createFakeService(user);
      serviceList.push(fakeService);
    }
    super(serviceList);
  }
  listAuthorizedUsers(serviceId: string): string[] {
    throw new Error("Method not implemented.");
  }
  listAuthorizedGroups(serviceId: string): string[] {
    throw new Error("Method not implemented.");
  }
  listOwners(serviceId: string): string[] {
    throw new Error("Method not implemented.");
  }
  createService(
    ownerId: string,
    credentials: ServiceCredential,
    serviceName: string,
  ): void {
    console.log(ownerId, credentials, serviceName);
    throw new Error("Method not implemented.");
  }
  override removeById(serviceId: string): void {
    try {
      super.removeById(serviceId);
    } catch (e) {
      throw Error(`service: ${serviceId} not removed, ${e}`);
    }
    this._allowedUser = this.allowedUser.filter((e) =>
      e.serviceId !== serviceId
    );
    this._allowedGroups = this.allowedGroups.filter((e) =>
      e.serviceId !== serviceId
    );
  }
}
