import { FakeObjectGen } from "../../FakeObjectGen.ts";
import { GroupRepository } from "../../interfaceTypes/GroupRepository.ts";
import { Group } from "../Group.ts";
import { User } from "../User.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";
import { listGroupInvitations } from "./InMemUserRepository.ts";

export class GroupInvitationView {
  get senderId(): string {
    return this._senderId;
  }

  get receiverId(): string {
    return this._receiverId;
  }
  constructor(private _senderId: string, private _receiverId: string) {
  }
}

export class InMemGroupRepository extends InMemoryRepository<Group>
  implements GroupRepository {
  constructor(user: User) {
    const testGroup: Group[] = [];

    for (let i = 0; i < 5; i++) {
      const fakeGroup = FakeObjectGen.createFakeGroup(undefined, user);
      testGroup.push(fakeGroup);
    }

    super(testGroup);
  }
  findOwnedByUserId(userId: string): Group[] {
    return this.inMemList.filter((group) => group.getOwner().getId() === userId)
      .map(this.hydrate);
  }
  hydrate(someGroup: Group): Group {
    someGroup.setInvitedUsers(
      listGroupInvitations().filter((e) => e.groupId === someGroup.getId()).map(
        (e) =>
          new GroupInvitationView(e.senderId, e.receiverId)
      ),
    );
    return someGroup;
  }
}
