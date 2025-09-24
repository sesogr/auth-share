import { Displayable } from "../../interfaceTypes/Displayable.ts";
import { Entity } from "../../interfaceTypes/Entity.ts";
import { GroupRepository } from "../../interfaceTypes/GroupRepository.ts";
import { ServiceRepositoryView } from "../../interfaceTypes/ServiceRepositoryView.ts";
import { AllowedGroupServiceMap } from "../AllowedGroupServiceMap.ts";
import { AllowedUserGroupMap } from "../AllowedUserGroupMap.ts";
import { Group } from "../Group.ts";
import { Invitation } from "../Invitation.ts";
import { User } from "../User.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

export class InMemGroupRepository extends InMemoryRepository<Group>
  implements GroupRepository {
  private _allowedUser: AllowedUserGroupMap[] = [];
  private _invitationList: Invitation<Group, User>[] = [];
  public get invitationList(): Invitation<Group, User>[] {
    return this._invitationList;
  }
  public get allowedUser(): AllowedUserGroupMap[] {
    return [...this._allowedUser];
  }
  constructor(private serviceRepoView: ServiceRepositoryView) {
    super();
  }

  viewInvitations(): Invitation<Group, User>[] {
    return [...this._invitationList];
  }
  override save(group: Group): void {
    let groupIndex = this.inMemList.findIndex((e) =>
      group.getId() === e.getId()
    );
    if (groupIndex < 0) {
      this.add(group);
      groupIndex = this.inMemList.length - 1;
    }
    this.inMemList[groupIndex] = group;
    this.updateAllowedUsers(group.allowedUser);
    this.updateInvites(group.sentInvitations);
  }
  private updateAllowedUsers(allowedUser: AllowedUserGroupMap[]) {
    const missingAllowedUsers = allowedUser.filter((e) =>
      !this.allowedUser.some((f) => e.equals(f))
    );
    this.allowedUser.push(...missingAllowedUsers);
    const unauthorizedUsers = this.allowedUser.filter((e) =>
      allowedUser.some((f) => e.equals(f))
    );
    this._allowedUser = this.allowedUser.filter((e) =>
      !unauthorizedUsers.some((f) => e.equals(f))
    );
  }
  private updateInvites(invites: Invitation<Group, User>[]) {
    const missingInvites = invites.filter((e) =>
      !this._invitationList.some((f) => e.equals(f))
    );
    this._invitationList.push(...missingInvites);
    const deletedInvites = this._invitationList.filter((e) =>
      !invites.some((f) => e.equals(f))
    );
    this._invitationList = this._invitationList.filter((e) =>
      !deletedInvites.some((f) => e.equals(f))
    );
  }
  override hydrate(_item: Group): Group {
    //get a db reference per parameter-->..-->return
    const groupDisplayName = _item.getDisplayName();
    const groupOwner = _item.getOwner();
    const groupId = _item.getId();
    const filterCallback = (
      currElement: AllowedGroupServiceMap,
    ): boolean => currElement.groupId === groupId;
    const serviceList = this.serviceRepoView.viewAllowedGroups().filter(
      filterCallback,
    );
    const filterCallback2 = (
      currElement: Invitation<Displayable & Entity, Displayable & Entity>,
    ): boolean => currElement.objReference.getId() === groupId;
    const sentInvitationList = this._invitationList.filter(filterCallback2);
    const serviceInvitations = this.serviceRepoView.viewInvitedGroups().filter(
      filterCallback2,
    );
    const allowedUser = this._allowedUser.filter((currElement) =>
      currElement.groupId === groupId
    );

    const group: Group = new Group(
      groupDisplayName,
      groupOwner,
      groupId,
      serviceList,
      sentInvitationList,
      serviceInvitations,
      allowedUser,
    );

    return group;
  }
  viewAllowedUser(): AllowedUserGroupMap[] {
    return [...this.allowedUser];
  }
  findOwnedByUserId(userId: string): Group[] {
    return this.allowedUser.filter((currMap) =>
      (currMap.userId === userId) && currMap.isOwner
    ).map((currMap) => this.findById(currMap.groupId));
  }
  listOwners(groupId: string): string {
    return this.findById(groupId).getOwner();
  }
  listAllowedUsers(groupId: string): string[] {
    return this.allowedUser.filter((e) => e.groupId === groupId)
      .map((
        e,
      ) => e.userId);
  }
}
