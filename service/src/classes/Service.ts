import { ConvertedService } from "../types/types.ts";
import { AllowedGroupServiceMap } from "./AllowedGroupServiceMap.ts";
import { AllowedUserServiceMap } from "./AllowedUserServiceMap.ts";
import { Entity } from "./Entity.ts";
import { Group } from "./Group.ts";
import { Invitation } from "./Invitation.ts";
import { ServiceCredential } from "./ServiceCredential.ts";
import { User } from "./User.ts";

export class Service extends Entity {
  public get serviceUrl(): string {
    return this._serviceUrl;
  }
  public get allowedGroups(): AllowedGroupServiceMap[] {
    return [...this._allowedGroups];
  }
  public get allowedUsers(): AllowedUserServiceMap[] {
    return [...this._allowedUsers];
  }
  public override get sentInvitations(): Invitation[] {
    return [...this._sentInvitations];
  }
  public get credentials(): ServiceCredential {
    return this._credentials;
  }
  constructor(
    private _credentials: ServiceCredential,
    private serviceName: string = "",
    private _serviceUrl: string = "",
    protected override readonly id: string = crypto.randomUUID(),
    private _sentInvitations: Invitation[] = [],
    //List for AuthorizedUsers
    private _allowedUsers: AllowedUserServiceMap[] = [],
    private _allowedGroups: AllowedGroupServiceMap[] = [],
  ) {
    super(id, serviceName);
  }
  giveAuthorizationToGroup(group: Group): void {
    this._allowedGroups.push(
      new AllowedGroupServiceMap(group.convertToShort(), this.convertToShort()),
    );
  }
  static createService(
    credentials: ServiceCredential,
    serviceName: string,
    serviceUrl: string,
    owner: User,
    id: string = crypto.randomUUID(),
  ) {
    const service = new Service(credentials, serviceName, serviceUrl, id);
    service._allowedUsers.push(
      new AllowedUserServiceMap(
        owner.convertToShort(),
        service.convertToShort(),
        true,
      ),
    );
    return service;
  }
  override getDisplayName(): string {
    return this.serviceName;
  }
  listAllowedUsers(onlyOwners = false): string[] {
    const mapCallback = (currentElement: AllowedUserServiceMap): string =>
      currentElement.getUsername;
    if (onlyOwners) {
      return this.allowedUsers.filter((currElement) => currElement.isOwner)
        .map(mapCallback);
    }
    return this.allowedUsers.map(mapCallback);
  }
  listAllowedGroups(): string[] {
    const mapCallback = (currElement: AllowedGroupServiceMap): string =>
      currElement.getGroupname;
    return this.allowedGroups.map(mapCallback);
  }
  giveAuthorizationToUser(user: User): void {
    this._allowedUsers.push(
      new AllowedUserServiceMap(user.convertToShort(), this.convertToShort()),
    );
  }
  toJsonString(): string {
    return JSON.stringify(this.convertToSerializeableObj());
  }
  private convertToSerializeableObj(): ConvertedService {
    return {
      credentials: {
        username: this._credentials.username!,
        password: this._credentials.password!,
      },
      serviceName: this.getDisplayName(),
      serviceUrl: this.serviceUrl,
      groups: this.listAllowedGroups(),
      users: this.listAllowedUsers(),
      owners: this.listAllowedUsers(true),
      sentInvitations: this.sentInvitations.map((e) => e.toString()),
    };
  }

  toJson() {
    return this.convertToSerializeableObj();
  }
  sendInvitation(receiver: Group, sender: User) {
    const invitation = new Invitation(
      sender.convertToShort(),
      this.convertToShort(),
      receiver.convertToShort(),
    );
    this._sentInvitations.push(invitation);
  }

  //callService() {}

  /*serviceIsInList(serviceName: string): boolean{
  return this.services.includes(serviceName);
} */
}
