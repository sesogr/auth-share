import { faker } from "@jackfiszr/faker";
import { User } from "./classes/User.ts";
import { UserCredential } from "./classes/UserCredential.ts";
import { Group } from "./classes/Group.ts";
import { Service } from "./classes/Service.ts";
import { ServiceCredential } from "./classes/ServiceCredential.ts";
import { ShortEntity } from "./interfaceTypes/ShortEntity.ts";
export class FakeObjectGen {
  static createFakeUser(
    userName = faker.internet.userName(),
    password = faker.internet.password(7, true, /.* /, ""),
    displayname = faker.name.findName(),
  ) {
    return User.createUser(new UserCredential(userName, password), displayname);
  }
  static createFakeGroup(
    groupDisplayName = faker.internet.domainName(),
    user: ShortEntity = FakeObjectGen.createFakeUser().convertToShort(),
  ) {
    return Group.createUserGroup(groupDisplayName, user);
  }
  static createFakeService(
    futureOwner: ShortEntity = FakeObjectGen.createFakeUser().convertToShort(),
  ) {
    return Service.createService(
      new ServiceCredential(
        faker.internet.userName(),
        faker.internet.password(7, true, /.*/, ""),
      ),
      faker.internet.domainName(),
      futureOwner,
    );
  }

  static generateFakeUsers(count: number = 10): User[] {
    const fakeUserList: User[] = [];
    for (let i = 0; i < count; i++) {
      const fakeUser = FakeObjectGen.createFakeUser();
      fakeUserList.push(fakeUser);
    }
    return fakeUserList;
  }

  static generateFakeGroups(count: number = 10): Group[] {
    const fakeGroupList: Group[] = [];
    for (let i = 0; i < count; i++) {
      const fakeUser = FakeObjectGen.createFakeGroup();
      fakeGroupList.push(fakeUser);
    }
    return fakeGroupList;
  }
  static generateFakeServices(count: number = 10): Service[] {
    const fakeServiceList: Service[] = [];
    for (let i = 0; i < count; i++) {
      const fakeService = FakeObjectGen.createFakeService();
      fakeServiceList.push(fakeService);
    }
    return fakeServiceList;
  }
}
