//import { GroupAlreadyAuthorizedError } from "../errors/GroupAlreadyAuthorizedError.ts";
import { Displayable } from "../interfaceTypes/Displayable.ts";
import { Entity } from "../interfaceTypes/Entity.ts";
//import { ConvertedService } from "../types/types.ts";
import { AllowedServiceMap } from "./AllowedServiceMap.ts";
import { Group } from "./Group.ts";
import { Invitation } from "./Invitation.ts";
import { ServiceCredential } from "./ServiceCredential.ts";
//import { User } from "./User.ts";

export class Service implements Displayable, Entity {
  private static readonly _allowedService: AllowedServiceMap[] = [];
  public static get allowedService(): AllowedServiceMap[] {
    return [...Service._allowedService];
  }
  private constructor(
    private ownerId: string,
    private credentials: ServiceCredential,
    private serviceName: string = "",
    private readonly id = crypto.randomUUID(),
    private groups: Group[] = [],
    private sentInvitations: Invitation<Service, Group>[] = [],
  ) {
  }
  getId(): string {
    return this.id;
  }
  getDisplayName(): string {
    return this.serviceName;
  }
  listUsers(): string[] {
    return Service.allowedService.filter((e) => e.serviceId === this.id).map((
      e,
    ) => e.userId);
  }
  listGroups(): Group[] {
    return [...this.groups];
  }
  listOwners(): string[] {
    return Service.allowedService.filter((e) => e.serviceId === this.id).filter(
      (e) => e.isOwner,
    ).map((
      e,
    ) => e.userId);
  }
  static createService(
    ownerId: string,
    credentials: ServiceCredential,
    serviceName: string,
  ): Service {
    const service = new Service(ownerId, credentials, serviceName);
    Service._allowedService.push(
      new AllowedServiceMap(ownerId, service.id, true),
    );
    return service;
  }
  giveAuthorizationToUser(userId: string): void {
    Service._allowedService.push(new AllowedServiceMap(userId, this.id));
  }
  /*
  sendInvitation(receiver: Group, sender: User = this.owners[0]) {
    if (this.receiverIsInGroups(receiver)) {
      throw new GroupAlreadyAuthorizedError(
        `The group ${receiver.getDisplayName()} is already using the service ${this.getDisplayName()}!`,
      );
    }
    const invitation = new Invitation<Service, Group>(sender, this, receiver);
    this.sentInvitations.push(invitation);
    receiver.addServiceInvitation(invitation);
  }
  deleteService() {
    this.users.forEach((currUser) => {
      currUser.removeService(this);
    });
    this.groups.forEach((currGroup) => {
      currGroup.removeService(this);
    });
    this.invitation.forEach((currInvitation)=> {
    currInvitation.
  })


  callService() {}

  receiverIsInGroups(receiver: Group): boolean {
    return this.groups.includes(receiver);
  }
  toJsonString(): string {
    return JSON.stringify(this.convertToSerializeableObj());
  }
  private convertToSerializeableObj(): ConvertedService {
    return {
      serviceName: this.serviceName,
      credentials: this.credentials.toString(),
      users: this.users.map((e) => e.getDisplayName()),
      owners: this.owners.map((e) => e.getDisplayName()),
      groups: this.groups.map((e) => e.getDisplayName()),
      sentInvitations: this.sentInvitations.map((e) => e.toString()),
    };
  }

  toJson() {
    return this.convertToSerializeableObj();
  }
  /*serviceIsInList(serviceName: string): boolean{
  return this.services.includes(serviceName);
}*/
}
