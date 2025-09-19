import { FakeObjectGen } from "../../FakeObjectGen.ts";
import { GroupRepository } from "../../interfaceTypes/GroupRepository.ts";
import { AllowedUserGroupMap } from "../AllowedUserGroupMap.ts";
import { AllowedUserServiceMap } from "../AllowedUserServiceMap.ts";
import { Group } from "../Group.ts";
import { User } from "../User.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

export class InMemGroupRepository extends InMemoryRepository<Group>
  implements GroupRepository {
  private _allowedUser: AllowedUserGroupMap[] = [];
  public get allowedUser(): AllowedUserGroupMap[] {
    return [...this._allowedUser];
  }
  constructor(user: User) {
    const testGroup: Group[] = [];

    for (let i = 0; i < 5; i++) {
      const fakeGroup = FakeObjectGen.createFakeGroup(undefined, user);
      testGroup.push(fakeGroup);
    }

    super(testGroup);
  }
  listOwners(groupId: string): string {
    return this.findById(groupId).getOwnerId();
  }
  listAllowedUsers(groupId: string): string[] {
    return this.allowedUser.filter((e) => e.groupId === groupId)
      .map((
        e,
      ) => e.userId);
  }
  createUserGroup(groupname: string, ownerId: string): Group {
    const newGroup = new Group(groupname, ownerId);
    this._allowedUser.push(new AllowedUserGroupMap(newGroup.getId(), ownerId));
    return newGroup;
  }
}
