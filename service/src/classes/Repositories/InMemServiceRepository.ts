import { FakeObjectGen } from "../../FakeObjectGen.ts";
import { ServiceRepository } from "../../interfaceTypes/ServiceRepository.ts";
import { ConvertedService } from "../../types/ConvertedService.ts";

import { AllowedGroupMap } from "../AllowedGroupMap.ts";
import { AllowedUserMap } from "../AllowedUserMap.ts";

import { Service } from "../Service.ts";
import { ServiceCredential } from "../ServiceCredential.ts";
import { User } from "../User.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

export class InMemServiceRepository extends InMemoryRepository<Service>
  implements ServiceRepository {
  private _allowedUser: AllowedUserMap[] = [];
  public get allowedUser(): AllowedUserMap[] {
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
    return this.allowedUser.filter((e) => e.serviceId === serviceId).map((
      e,
    ) => e.userId);
  }
  listAuthorizedGroups(serviceId: string): string[] {
    return this.allowedGroups.filter((e) => e.serviceId === serviceId).map((
      e,
    ) => e.groupId);
  }
  listOwners(serviceId: string): string[] {
    return this.allowedUser.filter((e) => e.serviceId === serviceId).filter(
      (e) => e.isOwner,
    ).map((
      e,
    ) => e.userId);
  }
  createService(
    ownerId: string,
    credentials: ServiceCredential,
    serviceName: string,
  ): void {
    const service = new Service(credentials, serviceName);
    this._allowedUser.push(
      new AllowedUserMap(ownerId, service.getId(), true),
    );
  }
  giveAuthorizationToUser(serviceId: string, userId: string): void {
    this._allowedUser.push(new AllowedUserMap(userId, serviceId));
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
  toJsonString(serviceId: string): string {
    return JSON.stringify(this.convertToSerializeableObj(serviceId));
  }
  private convertToSerializeableObj(serviceId: string): ConvertedService {
    const service: Service = this.findById(serviceId);
    return {
      serviceName: service.getDisplayName(),
      credentials: service.credentials,
      groups: this.listAuthorizedGroups(serviceId),
      users: this.listAuthorizedUsers(serviceId),
      owners: this.listOwners(serviceId),
      sentInvitations: service.sentInvitations.map((e) => e.toString()),
    };
  }

  toJson(serviceId: string) {
    return this.convertToSerializeableObj(serviceId);
  }
}
