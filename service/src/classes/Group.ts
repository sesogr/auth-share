import { DuplicateError } from "../errors/DuplicateError.ts";
import { ShortEntity } from "../interfaceTypes/ShortEntity.ts";
import { ConvertedGroup } from "../types/types.ts";
import { AllowedGroupServiceMap } from "./AllowedGroupServiceMap.ts";
import { AllowedUserGroupMap } from "./AllowedUserGroupMap.ts";
import { Entity } from "./Entity.ts";
import { Invitation } from "./Invitation.ts";
import { User } from "./User.ts";

export class Group extends Entity {
  public override get sentInvitations(): Invitation[] {
    return [...this._sentInvitations];
  }
  public get allowedUser(): AllowedUserGroupMap[] {
    return [...this._allowedUser];
  }
  public constructor(
    private groupname: string,
    private owner: ShortEntity,
    protected override readonly id: string = crypto.randomUUID(),
    private serviceList: AllowedGroupServiceMap[] = [],
    private readonly _sentInvitations: Invitation[] = [],
    private serviceInvitations: Invitation[] = [],
    private readonly _allowedUser: AllowedUserGroupMap[] = [],
  ) {
    super(id, groupname);
  }
  override getId(): string {
    return this.id;
  }
  override getDisplayName(): string {
    return this.groupname;
  }
  giveAuthorizationToUser(user: User): void {
    if (this.allowedUser.some((e) => e.userId == user.getId())) {
      throw new DuplicateError("User is already allowed to join");
    }
    this.allowedUser.push(
      new AllowedUserGroupMap(user.convertToShort(), this.convertToShort()),
    );
  }
  listAllowedUsers(owned = false): string[] {
    const mapCallback = (currElement: AllowedUserGroupMap): string =>
      currElement.userId;
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
    newGroup.allowedUser.push(
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
    this.sentInvitations.push(
      new Invitation(
        senderReference.convertToShort(),
        this.convertToShort(),
        receiverReference.convertToShort(),
      ),
    );
  }
  getOwner(): ShortEntity {
    return this.owner;
  }
  toJsonString(): string {
    return JSON.stringify(this.showAll());
  }
  private showAll(): ConvertedGroup {
    return {
      groupname: this.groupname,
      owner: this.getOwner().displayname,
      users: this.allowedUser.map((e) => e.username),
      serviceList: this.serviceList.map((e) => e.servicename),
      sentInvitations: this.sentInvitations.map((e) => e.toString()),
      serviceInvitations: this.serviceInvitations.map((e) => e.toString()),
    };
  }

  toJson() {
    return this.showAll();
  }
}
