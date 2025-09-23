import { FakeObjectGen } from "../../FakeObjectGen.ts";
import { ServiceRepository } from "../../interfaceTypes/ServiceRepository.ts";

import { AllowedGroupServiceMap } from "../AllowedGroupServiceMap.ts";
import { AllowedUserServiceMap } from "../AllowedUserServiceMap.ts";
import { Group } from "../Group.ts";
import { Invitation } from "../Invitation.ts";

import { Service } from "../Service.ts";
import { ServiceCredential } from "../ServiceCredential.ts";
import { User } from "../User.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

export class InMemServiceRepository extends InMemoryRepository<Service>
  implements ServiceRepository {
  override save(service: Service): void {
    let serviceIndex = this.inMemList.findIndex((e) =>
      service.getId() === e.getId()
    );
    if (!serviceIndex) {
      this.add(service);
      serviceIndex = this.inMemList.length - 1;
    }
    this.inMemList[serviceIndex] = service;
    this.updateInvites(service.sentInvitations);
    this.updateAllowedUsers(service.authorizedUsers);
    this.updateAllowedGroups(service.authorizedGroups);
  }
  private updateInvites(invites: Invitation<Service, Group>[]) {
    const missingInvites = invites.filter((e) =>
      !this.invitations.some((f) => e.equals(f))
    );
    this.invitations.push(...missingInvites);
    const deletedInvites = this.invitations.filter((e) =>
      invites.some((f) => e.equals(f))
    );
    this.invitations = this.invitations.filter((e) =>
      !deletedInvites.some((f) => e.equals(f))
    );
  }
  private updateAllowedUsers(authorizedUsers: AllowedUserServiceMap[]) {
    const missingAllowedUsers = authorizedUsers.filter((e) =>
      !this.allowedUser.some((f) => e.equals(f))
    );
    this.allowedUser.push(...missingAllowedUsers);
    const unauthorizedUsers = this.allowedUser.filter((e) =>
      authorizedUsers.some((f) => e.equals(f))
    );
    this.allowedUser = this.allowedUser.filter((e) =>
      !unauthorizedUsers.some((f) => e.equals(f))
    );
  }
  private updateAllowedGroups(authorizedGroups: AllowedGroupServiceMap[]) {
    const missingAllowedGroups = authorizedGroups.filter((e) =>
      !this.allowedGroups.some((f) => e.equals(f))
    );
    this.allowedGroups.push(...missingAllowedGroups);
    const unauthorizedUsers = this.allowedGroups.filter((e) =>
      authorizedGroups.some((f) => e.equals(f))
    );
    this.allowedGroups = this.allowedGroups.filter((e) =>
      !unauthorizedUsers.some((f) => e.equals(f))
    );
  }
  override hydrate(_item: Service): Service {
    throw new Error("unimplemented");
  }
  private allowedUser: AllowedUserServiceMap[] = [];

  private allowedGroups: AllowedGroupServiceMap[] = [];
  private invitations: Invitation<Service, Group>[] = [];
  constructor(user: User) {
    const serviceList: Service[] = [];
    for (let i = 0; i < 10; i++) {
      const fakeService = FakeObjectGen.createFakeService(user);
      serviceList.push(fakeService);
    }
    super(serviceList);
  }
  createService(
    _ownerId: string,
    _credentials: ServiceCredential,
    _serviceName: string,
  ): Service {
    throw new Error("Method not implemented.");
  }
  findOwnedByUserId(userId: string): Service[] {
    return this.allowedUser.filter((currMap) =>
      (currMap.userId === userId) && currMap.isOwner
    ).map((currMap) => this.findById(currMap.serviceId));
  }
  findAuthorizedForId(_Id: string): Service[] {
    throw new Error("Method not implemented.");
  }
  viewAllowedUser(): AllowedUserServiceMap[] {
    return [...this.allowedUser];
  }
  viewAllowedGroups(): AllowedGroupServiceMap[] {
    return [...this.allowedGroups];
  }
  viewInvitedGroups(): Invitation<Service, Group>[] {
    return [...this.invitations];
  }
  override removeById(serviceId: string): void {
    try {
      super.removeById(serviceId);
    } catch (e) {
      throw Error(`service: ${serviceId} not removed, ${e}`);
    }
    this.allowedUser = this.allowedUser.filter((e) =>
      e.serviceId !== serviceId
    );
    this.allowedGroups = this.allowedGroups.filter((e) =>
      e.serviceId !== serviceId
    );
  }
}
