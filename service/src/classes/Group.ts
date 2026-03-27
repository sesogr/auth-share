import { AuthorizationError } from "../errors/controllerErrors/AuthorizationError.ts";
import { DuplicateError } from "../errors/DuplicateError.ts";
import { ConvertedGroup } from "../types/types.ts";
import { AllowedGroupServiceMap } from "./AllowedGroupServiceMap.ts";
import { AllowedUserGroupMap } from "./AllowedUserGroupMap.ts";
import { Entity } from "./Entity.ts";
import { IdNameMap } from "./IdNameMap.ts";
import { Invitation } from "./Invitation.ts";
import { User, ValidatedUser } from "./User.ts";
import { AlreadyTakenError } from "../errors/controllerErrors/ConflictError/AlreadyTakenError.ts";

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
      throw new AuthorizationError(
        `${user.getDisplayName()} doesn't own this Group`,
      );
    }
  }

  giveAuthorizationToUser(user: IdNameMap | User): void {
    let userinfo: IdNameMap;
    if (user instanceof User) {
      userinfo = user.convertToShort();
    } else {
      userinfo = user;
    }
    if (this.allowedUser.some((e) => e.getUserId == userinfo.id)) {
      throw new DuplicateError("User is already allowed");
    }
    this._allowedUser.push(
      new AllowedUserGroupMap(userinfo, this.convertToShort()),
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
  acceptInvitation(invitation: Invitation): void {
    const realInviteIndex = this._sentInvitations.findIndex((e) =>
      e.equals(invitation)
    );
    if (realInviteIndex === -1) {
      throw new AuthorizationError("The Invitation is Invalid");
    }
    this.giveAuthorizationToUser(
      this._sentInvitations[realInviteIndex].receiverReference,
    );
    this._sentInvitations.splice(realInviteIndex, 1);
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
    senderReference: ValidatedUser,
    receiverReference: User,
  ) {
    this.checkOwner(senderReference);
    const invitation = new Invitation(
      senderReference.convertToShort(),
      this.convertToShort(),
      receiverReference.convertToShort(),
      "group",
    );

    if (this.sentInvitations.find((e) => e.equals(invitation))) {
      throw new DuplicateError("");
    }
    this._sentInvitations.push(invitation);
  }
  sendMultipleInvitations(
    senderReference: ValidatedUser,
    receiverReferences: User[],
  ): { fulfilled: User[]; alreadyIn: User[] } {
    this.checkOwner(senderReference);
    const result: { fulfilled: User[]; alreadyIn: User[] } = {
      fulfilled: [],
      alreadyIn: [],
    };
    receiverReferences.forEach((user) => {
      try {
        this.sendInvitation(senderReference, user);
        result.fulfilled.push(user);
      } catch (e) {
        if (e instanceof AlreadyTakenError) {
          result.alreadyIn.push(user);
        }
      }
    });
    return result;
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
