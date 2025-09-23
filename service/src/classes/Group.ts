import { WrongReceiverError } from "../errors/WrongReceiverError.ts";
import { Displayable } from "../interfaceTypes/Displayable.ts";
import { Entity } from "../interfaceTypes/Entity.ts";
import { ConvertedGroup } from "../types/types.ts";
import { AllowedGroupServiceMap } from "./AllowedGroupServiceMap.ts";
import { AllowedUserGroupMap } from "./AllowedUserGroupMap.ts";
import { Invitation } from "./Invitation.ts";
import { Service } from "./Service.ts";
import { User } from "./User.ts";

export class Group implements Displayable, Entity {
  private constructor(
    private groupname: string,
    private owner: string,
    private readonly id = crypto.randomUUID(),
    private users: string[] = [],
    private serviceList: AllowedGroupServiceMap[] = [],
    private sentInvitations: Invitation<Group, User>[] = [],
    private serviceInvitations: Invitation<Service, Group>[] = [],
    private allowedUser: AllowedUserGroupMap[] = [],
  ) {}
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
  listServiceInvitation(): Invitation<Service, Group>[] {
    return [...this.serviceInvitations];
  }
  listSentInvitation(): Invitation<Group, User>[] {
    return [...this.sentInvitations];
  }
  static createUserGroup(groupname: string, ownerId: string): Group {
    const newGroup = new Group(groupname, ownerId);
    newGroup.allowedUser.push(
      new AllowedUserGroupMap(newGroup.getId(), ownerId, true),
    );
    return newGroup;
  }
  // sendInvitation(receiver: User) {
  //   const invite: Invitation<Group, User> = new Invitation(
  //     this.owner,
  //     this,
  //     receiver,
  //   );
  //   this.sentInvitations.push(invite);
  //   receiver.addInvitation(invite);
  // }
  addServiceInvitation(newServiceInvite: Invitation<Service, Group>) {
    const receiver = newServiceInvite.receiverReference;
    if (receiver != this) {
      throw new WrongReceiverError(
        `This is not Group: ${receiver.getDisplayName()}`,
      );
    }
    this.serviceInvitations.push(newServiceInvite);
  }
  /*groupAlreadyExist(groupname: string): boolean{
  return this.groupList.includes(groupname);
  */
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
      users: this.users,
      serviceList: this.serviceList.map((e) => e.serviceId),
      sentInvitations: this.sentInvitations.map((e) => e.toString()),
      serviceInvitations: this.serviceInvitations.map((e) => e.toString()),
    };
  }

  toJson() {
    return this.showAll();
  }
}
