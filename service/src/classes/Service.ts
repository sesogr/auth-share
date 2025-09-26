import { DisplayableEntity } from "../interfaceTypes/DisplayableEntity.ts";
import { ConvertedService } from "../types/types.ts";
import { AllowedGroupServiceMap } from "./AllowedGroupServiceMap.ts";
import { AllowedUserServiceMap } from "./AllowedUserServiceMap.ts";
import { Group } from "./Group.ts";
import { Invitation } from "./Invitation.ts";
import { ServiceCredential } from "./ServiceCredential.ts";
import { User } from "./User.ts";

export class Service implements DisplayableEntity {
  public get authorizedGroups(): AllowedGroupServiceMap[] {
    return [...this._authorizedGroups];
  }
  public set authorizedGroups(value: AllowedGroupServiceMap[]) {
    this._authorizedGroups = value;
  }
  public get authorizedUsers(): AllowedUserServiceMap[] {
    return [...this._authorizedUsers];
  }
  public set authorizedUsers(value: AllowedUserServiceMap[]) {
    this._authorizedUsers = value;
  }
  public get sentInvitations(): Invitation[] {
    return this._sentInvitations;
  }
  public set sentInvitations(value: Invitation[]) {
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
    private readonly id: string = crypto.randomUUID(),
    private _sentInvitations: Invitation[] = [],
    //List for AuthorizedUsers
    private _authorizedUsers: AllowedUserServiceMap[] = [],
    private _authorizedGroups: AllowedGroupServiceMap[] = [],
  ) {
  }
  static createService(
    credentials: ServiceCredential,
    serviceName: string,
    ownerId: string,
    id: string = crypto.randomUUID(),
  ) {
    const service = new Service(credentials, serviceName, id);
    service._authorizedUsers.push(new AllowedUserServiceMap(ownerId, id, true));
    return service;
  }
  convertToShort(): DisplayableEntity {
    return {
      getId: () => this.getId(),
      getDisplayName: () => this.getDisplayName(),
      convertToShort: () => this.convertToShort(),
    };
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
    const mapCallback = (currElement: AllowedGroupServiceMap): string =>
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
  giveAuthorizationToUser(userId: string): void {
    this._authorizedUsers.push(new AllowedUserServiceMap(userId, this.getId()));
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
  sendInvitation(receiver: Group, sender: User) {
    const invitation = new Invitation(sender, this.convertToShort(), receiver);
    this._sentInvitations.push(invitation);
  }

  callService() {}

  /*serviceIsInList(serviceName: string): boolean{
  return this.services.includes(serviceName);
} */
}
