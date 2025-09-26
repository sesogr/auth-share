import { DisplayableEntity } from "../interfaceTypes/DisplayableEntity.ts";
import { ConvertedGroup } from "../types/types.ts";
import { AllowedGroupServiceMap } from "./AllowedGroupServiceMap.ts";
import { AllowedUserGroupMap } from "./AllowedUserGroupMap.ts";
import { Invitation } from "./Invitation.ts";

export class Group implements DisplayableEntity {
  public get allowedUser(): AllowedUserGroupMap[] {
    return this._allowedUser;
  }
  public constructor(
    private groupname: string,
    private owner: string,
    private readonly id: string = crypto.randomUUID(),
    private serviceList: AllowedGroupServiceMap[] = [],
    private sentInvitations: Invitation[] = [],
    private serviceInvitations: Invitation[] = [],
    private _allowedUser: AllowedUserGroupMap[] = [],
  ) {}
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
    return this.groupname;
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
  static createUserGroup(groupname: string, ownerId: string): Group {
    const newGroup = new Group(groupname, ownerId);
    newGroup.allowedUser.push(
      new AllowedUserGroupMap(ownerId, newGroup.getId(), true),
    );
    return newGroup;
  }
  sendInvitation(
    senderReference: DisplayableEntity,
    receiverObj: DisplayableEntity,
  ) {
    this.sentInvitations.push(
      new Invitation(
        senderReference,
        this.convertToShort(),
        receiverObj,
      ),
    );
  }
  getOwner(): string {
    return this.owner;
  }
  toJsonString(): string {
    return JSON.stringify(this.showAll());
  }
  private showAll(): ConvertedGroup {
    return {
      groupname: this.groupname,
      owner: this.owner,
      users: this._allowedUser.map((e) => e.userId),
      serviceList: this.serviceList.map((e) => e.serviceId),
      sentInvitations: this.sentInvitations.map((e) => e.toString()),
      serviceInvitations: this.serviceInvitations.map((e) => e.toString()),
    };
  }

  toJson() {
    return this.showAll();
  }
}
