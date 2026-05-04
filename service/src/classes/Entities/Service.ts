import { AuthorizationError } from "../errors/controllerErrors/AuthorizationError.ts";
import { ConvertedService } from "../../types/types.ts";
import { AllowedGroupServiceMap } from "../Values/AllowedGroupServiceMap.ts";
import { AllowedUserServiceMap } from "../Values/AllowedUserServiceMap.ts";
import { Entity } from "../Entity.ts";
import { Group } from "./Group.ts";
import { Invitation } from "../Values/Invitation.ts";
import { ServiceCredential } from "../Values/ServiceCredential.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
import { DuplicateError } from "../errors/DuplicateError.ts";
import { HasInvitations } from "../../../interfaceTypes/HasInvitations.ts";
import { IdNameMap } from "../Values/IdNameMap.ts";
import { ValidatedUser } from "../../../interfaceTypes/ValidatedUser.ts";
import { UserI } from "../../../interfaceTypes/UserI.ts";

export type OwnedService = { zzz: never } & Service;
export class Service extends Entity implements HasInvitations {
  public get serviceUrl(): string {
    return this._serviceUrl;
  }
  public get allowedGroups(): AllowedGroupServiceMap[] {
    return [...this._allowedGroups];
  }
  public get allowedUsers(): AllowedUserServiceMap[] {
    return [...this._allowedUsers];
  }
  public get sentInvitations(): Invitation[] {
    return [...this._sentInvitations];
  }
  public get credentials(): ServiceCredential {
    return this._credentials;
  }
  private ownedService: boolean = false;
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
    super(id, serviceName, "service");
  }
  acceptInvitation(invitation: Invitation): void {
    const realInviteIndex = this._sentInvitations.findIndex((e) =>
      e.equals(invitation)
    );
    if (realInviteIndex === -1) {
      throw new NotFoundError(
        "Invitation",
        "Invitation in Service",
        invitation.toString(),
      );
    }
    this._sentInvitations.splice(realInviteIndex, 1);
    this._allowedGroups.push(
      this.createAllowedGroupServiceMap(invitation.receiverReference),
    );
  }
  giveAuthorizationToGroup(group: Group): void {
    this._allowedGroups.push(
      this.createAllowedGroupServiceMap(group.convertToShort()),
    );
  }

  private createAllowedGroupServiceMap(group: IdNameMap) {
    return new AllowedGroupServiceMap(
      group,
      this.convertToShort(),
    );
  }

  checkOwner(user: UserI): asserts this is OwnedService {
    if (!this.allowedUsers.find((e) => e.getUserId == user.getId())) {
      throw new AuthorizationError(`You are not an Owner`);
    }
    this.ownedService = true;
  }
  static createService(
    credentials: ServiceCredential,
    serviceName: string,
    serviceUrl: string,
    owner: ValidatedUser,
    id?: string,
  ): OwnedService {
    const service: Service = new Service(
      credentials,
      serviceName,
      serviceUrl,
      id,
    );
    service._allowedUsers.push(
      new AllowedUserServiceMap(
        owner.convertToShort(),
        service.convertToShort(),
        true,
      ),
    );
    service.checkOwner(owner);
    return service;
  }
  override getDisplayName(): string {
    return this.serviceName;
  }
  promoteUser(user: string) {
    const toPromoteI = this._allowedUsers.findIndex((allowedUser) =>
      allowedUser.getUsername === user
    );
    const toPromote = this._allowedUsers[toPromoteI];
    if (!toPromote) {
      throw new NotFoundError("allowed User", "display name", user);
    }
    if (toPromote.isOwner) {
      throw new DuplicateError(user + " already Owner");
    }
    this._allowedUsers[toPromoteI] = toPromote.with({ isOwner: true });
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
  giveAuthorizationToUser(user: UserI): void {
    const userMap = user.convertToShort();
    if (this.allowedUsers.some((e) => userMap.displayname === e.getUsername)) {
      throw new DuplicateError(
        userMap.displayname + "already authorized",
      );
    }
    this._allowedUsers.push(
      new AllowedUserServiceMap(userMap, this.convertToShort()),
    );
  }
  toJsonString(): string {
    return JSON.stringify(this.convertToSerializableObj());
  }
  private convertToSerializableObj(): ConvertedService {
    if (!this.ownedService) {
      return {
        credentials: {
          username: this._credentials.username!,
          password: this._credentials.password!,
        },
        serviceName: this.getDisplayName(),
        serviceUrl: this.serviceUrl,
        id: this.id,
      };
    }
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
      id: this.id,
    };
  }

  toJson() {
    return this.convertToSerializableObj();
  }
  sendInvitation(receiver: Group, sender: UserI) {
    const invitation = new Invitation(
      sender.convertToShort(),
      this.convertToShort(),
      receiver.convertToShort(),
      "service",
    );
    if (this.sentInvitations.find((e) => e.equals(invitation))) {
      throw new DuplicateError(
        invitation + "already sent",
      );
    }
    this._sentInvitations.push(invitation);
  }
}
