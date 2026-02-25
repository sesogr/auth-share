import { ServiceAggregateView } from "../../../interfaceTypes/ServiceAggregateView.ts";
import { ServiceRepository } from "../../../interfaceTypes/ServiceRepository.ts";
import { AllowedGroupServiceMap } from "../../AllowedGroupServiceMap.ts";
import { AllowedUserServiceMap } from "../../AllowedUserServiceMap.ts";
import { Invitation } from "../../Invitation.ts";
import { Service } from "../../Service.ts";
import { ServiceCredential } from "../../ServiceCredential.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

export class InMemServiceRepository extends InMemoryRepository<Service>
  implements ServiceRepository, ServiceAggregateView {
  private allowedUser: AllowedUserServiceMap[] = [];
  private allowedGroups: AllowedGroupServiceMap[] = [];
  private invitations: Invitation[] = [];
  constructor() {
    super();
  }

  override save(service: Service): Promise<void> {
    let serviceIndex = this.inMemList.findIndex((e) =>
      service.getId() === e.getId()
    );
    if (serviceIndex < 0) {
      this.add(service);
      serviceIndex = this.inMemList.length - 1;
    }
    this.inMemList[serviceIndex] = service;
    this.updateInvites(service.sentInvitations);
    this.updateAllowedUsers(service.allowedUsers);
    this.updateAllowedGroups(service.allowedGroups);
    return Promise.resolve();
  }
  private updateInvites(invites: Invitation[]) {
    const missingInvites = invites.filter((e) =>
      !this.invitations.some((f) => e.equals(f))
    );
    this.invitations.push(...missingInvites);

    const extraInvites = this.invitations.filter((e) =>
      e.objId === invites[0].objId
    ).filter((e) => !invites.some((f) => e.equals(f)));
    this.invitations = this.invitations.filter((e) =>
      extraInvites.every((f) => !e.equals(f))
    );
  }
  private updateAllowedUsers(allowedUser: AllowedUserServiceMap[]) {
    const missingAllowedUsers = allowedUser.filter((e) =>
      !this.allowedUser.some((f) => e.equals(f))
    );
    this.allowedUser.push(...missingAllowedUsers);
    const extraAllowedUsers = this.allowedUser.filter((e) =>
      e.getGroupId === allowedUser[0].getGroupId
    ).filter((e) => !allowedUser.some((f) => e.equals(f)));
    this.allowedUser = this.allowedUser.filter((e) =>
      extraAllowedUsers.every((f) => !e.equals(f))
    );
  }
  private updateAllowedGroups(authorizedGroups: AllowedGroupServiceMap[]) {
    const missingAllowedGroups = authorizedGroups.filter((e) =>
      !this.allowedGroups.some((f) => e.equals(f))
    );
    this.allowedGroups.push(...missingAllowedGroups);
    const extraAllowedGroups = this.allowedGroups.filter((e) =>
      e.getServiceId === authorizedGroups[0].getServiceId
    ).filter((e) => !authorizedGroups.some((f) => e.equals(f)));
    this.allowedGroups = this.allowedGroups.filter((e) =>
      extraAllowedGroups.every((f) => !e.equals(f))
    );
  }
  override hydrate(service: Service): Promise<Service> {
    const credentials = new ServiceCredential(
      ...service.credentials.toString().split(":"),
    );
    const serviceName = service.getDisplayName();
    const serviceId = service.getId();
    const sentInvitations = this.invitations.filter((e) =>
      e.objId === serviceId
    );
    const authorizedUsers = this.allowedUser.filter((e) =>
      e.getServiceId === serviceId
    );
    const authorizedGroups = this.allowedGroups.filter((e) =>
      e.getServiceId === serviceId
    );
    const hydratedService: Service = new Service(
      credentials,
      serviceName,
      service.serviceUrl,
      serviceId,
      sentInvitations,
      authorizedUsers,
      authorizedGroups,
    );
    return Promise.resolve(hydratedService);
  }
  findOwnedByUserId(userId: string): Promise<Service[]> {
    return Promise.all(
      this.allowedUser.filter((currMap) =>
        (currMap.getUserId === userId) && currMap.isOwner
      ).map((currMap) => this.findById(currMap.getServiceId)),
    );
  }
  findAuthorizedForId(id: string): Promise<Service[]> {
    return Promise.all(
      this.allowedUser.filter((e) => e.getUserId === id).map((f) =>
        this.findById(f.getServiceId)
      ),
    );
  }
  viewAllowedUser(): AllowedUserServiceMap[] {
    return [...this.allowedUser];
  }
  viewAllowedGroups(): AllowedGroupServiceMap[] {
    return [...this.allowedGroups];
  }
  viewInvitedGroups(): Invitation[] {
    return [...this.invitations];
  }
  override removeById(serviceId: string): Promise<void> {
    try {
      super.removeById(serviceId);
    } catch (e) {
      throw Error(`service: ${serviceId} not removed, ${e}`);
    }
    this.allowedUser = this.allowedUser.filter((e) => e.serviceId);
    this.allowedGroups = this.allowedGroups.filter((e) =>
      e.getServiceId !== serviceId
    );
    return Promise.resolve();
  }
}
