import { FakeObjectGen } from "../../FakeObjectGen.ts";
import { GroupRepositoryView } from "../../interfaceTypes/GroupRepositoryView.ts";
import { ServiceRepositoryView } from "../../interfaceTypes/ServiceRepositoryView.ts";
import { User } from "../User.ts";
import { UserCredential } from "../UserCredential.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

export class InMemUserRepository extends InMemoryRepository<User> {
  constructor(
    private serviceRepoView?: ServiceRepositoryView,
    private groupRepoView?: GroupRepositoryView,
    private viewsetup?: boolean,
  ) {
    const userList: User[] = [];
    for (let i = 0; i < 10; i++) {
      const fakeUser = FakeObjectGen.createFakeUser();
      userList.push(fakeUser);
    }
    super(userList);
    if (serviceRepoView && groupRepoView) {
      this.viewsetup = true;
    }
  }
  setUpViews(
    serviceRepoView: ServiceRepositoryView,
    groupRepoView: GroupRepositoryView,
  ) {
    this.serviceRepoView = serviceRepoView;
    this.groupRepoView = groupRepoView;
    this.viewsetup = true;
  }
  override save(item: User): void {
    const index = this.inMemList.findIndex((e) => e.getId() === item.getId());
    if (!index) {
      this.add(item);
      return;
    }
    this.inMemList[index] = item;
  }
  override hydrate(item: User): User { //todo fix for actual userclass
    return User.createUser(
      new UserCredential("", ""),
      item.getDisplayName(),
    );
  }
}
