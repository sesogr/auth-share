import { GroupAggregateView } from "../../../interfaceTypes/GroupAggregateView.ts";
import { ServiceAggregateView } from "../../../interfaceTypes/ServiceAggregateView.ts";
import { UserRepository } from "../../../interfaceTypes/UserRepository.ts";
import { Session } from "../../Session.ts";
import { User } from "../../User.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";
export class InMemUserRepository extends InMemoryRepository<User>
  implements UserRepository {
  constructor(
    private serviceRepoView: ServiceAggregateView,
    private groupRepoView: GroupAggregateView,
  ) {
    super();
  }
  async findByUserName(username: string): Promise<User> {
    return this.hydrate(
      (await this.findAll()).find((e) =>
        e.getCredentials().username == username
      )!,
    );
  }
  async findBySessionToken(sessiontoken: string): Promise<User> {
    const sessionid = Session.fromSessionTokenToSessionId(sessiontoken);
    return this.hydrate(
      (await this.findAll()).find((e) =>
        e.sessions.find((e) => e.id == sessionid)
      )!,
    );
  }

  override save(item: User): Promise<void> {
    const index = this.inMemList.findIndex((e) => e.getId() === item.getId());
    if (index < 0) {
      this.add(item);
    }
    this.inMemList[index] = item;
    return Promise.resolve();
  }
  override hydrate(item: User): Promise<User> {
    const id = item.getId();
    const displayname = item.getDisplayName();
    const credentials = item.getCredentials();
    const serviceList = this.serviceRepoView.viewAllowedUser().filter((e) =>
      e.getUserId === id
    );
    const joinedGroups = this.groupRepoView.viewAllowedUser().filter((e) =>
      e.getUserId === id
    );
    const invitations = this.groupRepoView.viewInvitations().filter((e) =>
      e.receiverId === id
    );
    const user: User = new User(
      credentials,
      displayname,
      id,
      serviceList,
      invitations,
      joinedGroups,
    );
    return Promise.resolve(user);
  }
}
