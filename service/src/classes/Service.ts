import { Displayable } from "../interfaceTypes/Displayable.ts";
import { Entity } from "../interfaceTypes/Entity.ts";
import { ConvertedService } from "../types/types.ts";
import { AllowedGroupMap } from "./AllowedGroupMap.ts";
import { AllowedUserServiceMap } from "./AllowedUserServiceMap.ts";
import { Group } from "./Group.ts";
import { Invitation } from "./Invitation.ts";
import { ServiceCredential } from "./ServiceCredential.ts";

export class Service implements Displayable, Entity {
  public get sentInvitations(): Invitation<Service, Group>[] {
    return this._sentInvitations;
  }
  public set sentInvitations(value: Invitation<Service, Group>[]) {
    this._sentInvitations = value;
  }
  public get credentials(): string {
    return this._credentials.toString();
  }
  public set credentials(value: ServiceCredential) {
    this._credentials = value;
  }
  constructor(
    private _credentials: ServiceCredential,
    private serviceName: string = "",
    private readonly id = crypto.randomUUID(),
    private _sentInvitations: Invitation<Service, Group>[] = [],
    //List for AuthorizedUsers
    private authorizedUsers: AllowedUserServiceMap[] = [],
    private authorizedGroups: AllowedGroupMap[] = [],
  ) {
  }
  getId(): string {
    return this.id;
  }
  getDisplayName(): string {
    return this.serviceName;
  }
  listAuthorizedUsers(onlyOwners = false): string[] {
    const mapCallback = (currentElement: AllowedUserServiceMap): string =>
      currentElement.userId;
    if (onlyOwners) {
      return this.authorizedUsers.filter((currElement) => currElement.isOwner)
        .map(mapCallback);
    }
    return this.authorizedUsers.map(mapCallback);
  }
  listAuthorizedGroups(): string[] {
    const mapCallback = (currElement: AllowedGroupMap): string =>
      currElement.groupId;
    return this.authorizedGroups.map(mapCallback);
  }
  createService(
    ownerId: string,
    credentials: ServiceCredential,
    serviceName: string,
  ): void {
    const service = new Service(credentials, serviceName);
    this.authorizedUsers.push(
      new AllowedUserServiceMap(ownerId, service.getId(), true),
    );
  }
  giveAuthorizationToUser(serviceId: string, userId: string): void {
    this.authorizedUsers.push(new AllowedUserServiceMap(userId, serviceId));
  }
  toJsonString(): string {
    return JSON.stringify(this.convertToSerializeableObj());
  }
  private convertToSerializeableObj(): ConvertedService {
    return {
      serviceName: this.getDisplayName(),
      credentials: this.credentials,
      groups: this.listAuthorizedGroups(),
      users: this.listAuthorizedUsers(),
      owners: this.listAuthorizedUsers(true),
      sentInvitations: this.sentInvitations.map((e) => e.toString()),
    };
  }

  toJson() {
    return this.convertToSerializeableObj();
  }
  /**
 * sendInvitation(receiver: Group, sender: User = this.owners[0]) {
    if (this.receiverIsInGroups(receiver)) {
      throw new GroupAlreadyAuthorizedError(
        `The group ${receiver.getDisplayName()} is already using the service ${this.getDisplayName()}!`,
      );
    }
    const invitation = new Invitation<Service, Group>(sender, this, receiver);
    this.sentInvitations.push(invitation);
    receiver.addServiceInvitation(invitation);
  }
  */

  callService() {}

  // receiverIsInGroups(receiver: Group): boolean {
  //   return this.groups.includes(receiver);
  // }
  /*serviceIsInList(serviceName: string): boolean{
  return this.services.includes(serviceName);
} */
}
