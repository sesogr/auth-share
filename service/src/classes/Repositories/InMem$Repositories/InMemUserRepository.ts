import { GroupRepositoryView } from "../../../interfaceTypes/GroupRepositoryView.ts";
import { ServiceRepositoryView } from "../../../interfaceTypes/ServiceRepositoryView.ts";
import { UserRepository } from "../../../interfaceTypes/UserRepository.ts";
import { User } from "../../User.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

export class InMemUserRepository extends InMemoryRepository<User>
  implements UserRepository {
  constructor(
    private serviceRepoView: ServiceRepositoryView,
    private groupRepoView: GroupRepositoryView,
  ) {
    super();
  }

  override save(item: User): void {
    const index = this.inMemList.findIndex((e) => e.getId() === item.getId());
    if (index < 0) {
      this.add(item);
      return;
    }
    this.inMemList[index] = item;
  }
  override hydrate(item: User): User {
    const id = item.getId();
    const displayname = item.getDisplayName();
    const credentials = item.getCredentials();
    const serviceList = this.serviceRepoView.viewAllowedUser().filter((e) =>
      e.userId === id
    );
    const joinedGroups = this.groupRepoView.viewAllowedUser().filter((e) =>
      e.userId === id
    );
    const invitations = this.groupRepoView.viewInvitations().filter((e) =>
      e.receiverReference.getId() === id
    );
    const user: User = new User(
      credentials,
      displayname,
      id,
      serviceList,
      invitations,
      joinedGroups,
    );
    return user;
  }
}
