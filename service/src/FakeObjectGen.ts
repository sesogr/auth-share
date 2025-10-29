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
      faker.company.companyName(),
      //faker.internet.domainName() = serviceUrl
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

  static generateFakeGroups(
    userList: ShortEntity[] = [],
    count: number = 10,
  ): Group[] {
    const fakeGroupList: Group[] = [];
    for (let i = 0; i < count; i++) {
      const randomInt = Math.round(Math.random() * (userList.length - 1));

      const fakeUser = FakeObjectGen.createFakeGroup(
        undefined,
        userList[randomInt],
      );
      fakeGroupList.push(fakeUser);
    }
    return fakeGroupList;
  }
  static generateFakeServices(
    userList: ShortEntity[] = [],
    count: number = 10,
  ): Service[] {
    const fakeServiceList: Service[] = [];
    for (let i = 0; i < count; i++) {
      const randomInt = Math.round(Math.random() * (userList.length - 1));
      const fakeService = FakeObjectGen.createFakeService(userList[randomInt]);
      fakeServiceList.push(fakeService);
    }
    return fakeServiceList;
  }
}
