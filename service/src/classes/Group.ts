import { AuthorizationError } from "../errors/controllerErrors/AuthorizationError.ts";
import { DuplicateError } from "../errors/DuplicateError.ts";
import { ConvertedGroup } from "../types/types.ts";
import { AllowedGroupServiceMap } from "./AllowedGroupServiceMap.ts";
import { AllowedUserGroupMap } from "./AllowedUserGroupMap.ts";
import { Entity } from "./Entity.ts";
import { IdNameMap } from "./IdNameMap.ts";
import { Invitation } from "./Invitation.ts";
import { User } from "./User.ts";

export type OwnedGroups = Group & { zzz: never };

export class Group extends Entity {
  public get serviceList(): AllowedGroupServiceMap[] {
    return this._serviceList;
  }

  public override get sentInvitations(): Invitation[] {
    return [...this._sentInvitations];
  }

  public get allowedUser(): AllowedUserGroupMap[] {
    return [...this._allowedUser];
  }

  public constructor(
    private groupname: string,
    private owner: IdNameMap,
    protected override readonly id: string = crypto.randomUUID(),
    private _serviceList: AllowedGroupServiceMap[] = [],
    private readonly _sentInvitations: Invitation[] = [],
    private serviceInvitations: Invitation[] = [],
    private readonly _allowedUser: AllowedUserGroupMap[] = [],
  ) {
    super(id, groupname, "group");
  }

  override getDisplayName(): string {
    return this.groupname;
  }

  checkOwner(user: User): asserts this is OwnedGroups {
    if (!user.convertToShort().equals(this.owner)) {
      throw new AuthorizationError("You dont own this Group");
    }
  }

  giveAuthorizationToUser(user: User): void {
    if (this.allowedUser.some((e) => e.getUserId == user.getId())) {
      throw new DuplicateError("User is already allowed");
    }
    this._allowedUser.push(
      new AllowedUserGroupMap(user.convertToShort(), this.convertToShort()),
    );
  }

  listAllowedUsers(owned = false): string[] {
    const mapCallback = (currElement: AllowedUserGroupMap): string =>
      currElement.getUserId;
    if (owned) {
      return this.allowedUser.filter((currentElement) => currentElement.isOwner)
        .map(mapCallback);
    }
    return this.allowedUser.map(mapCallback);
  }

  listServiceInvitation(): Invitation[] {
    return [...this.serviceInvitations];
  }

  listSentInvitation(): Invitation[] {
    return [...this.sentInvitations];
  }

  static createUserGroup(groupname: string, owner: User): Group {
    const newGroup = new Group(groupname, owner.convertToShort());
    newGroup._allowedUser.push(
      new AllowedUserGroupMap(
        owner.convertToShort(),
        newGroup.convertToShort(),
        true,
      ),
    );
    return newGroup;
  }

  sendInvitation(
    senderReference: User,
    receiverReference: User,
  ) {
    const invitation = new Invitation(
      senderReference.convertToShort(),
      this.convertToShort(),
      receiverReference.convertToShort(),
    );

    if (this.sentInvitations.find((e) => e.equals(invitation))) {
      throw new DuplicateError("");
    }
    this._sentInvitations.push(invitation);
  }

  getOwner(): IdNameMap {
    return this.owner;
  }

  toJsonString(): string {
    return JSON.stringify(this.showAll());
  }

  private showAll(): ConvertedGroup {
    return {
      id: this.getId(),
      groupname: this.groupname,
      owner: this.getOwner().displayname,
      users: this.allowedUser.map((e) => e.getUsername),
      serviceList: this.serviceList.map((e) => e.getServicename),
      sentInvitations: this.sentInvitations.map((e) => e.toString()),
      serviceInvitations: this.serviceInvitations.map((e) => e.toString()),
    };
  }

  toJson() {
    return this.showAll();
  }
}
