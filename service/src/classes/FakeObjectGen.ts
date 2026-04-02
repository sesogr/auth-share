import { faker } from "@jackfiszr/faker";
import { User, ValidatedUser } from "./Entities/User.ts";
import { UserCredential } from "./Values/UserCredential.ts";
import { Group } from "./Entities/Group.ts";
import { Service } from "./Entities/Service.ts";
import { ServiceCredential } from "./Values/ServiceCredential.ts";
export class FakeObjectGen {
  static async createFakeUser(
    userName = faker.internet.userName(),
    password = faker.internet.password(7, true, /.* /, ""),
    displayname = faker.name.findName(),
  ) {
    return User.createUser(
      await UserCredential.create(userName, password),
      displayname,
    );
  }
  static async createFakeGroup(
    groupDisplayName = faker.internet.domainName(),
    user?: User,
  ) {
    return Group.createUserGroup(
      groupDisplayName,
      user ?? await FakeObjectGen.createFakeUser(),
    );
  }
  static async createFakeService(
    futureOwner?: ValidatedUser,
  ) {
    return Service.createService(
      new ServiceCredential(
        faker.internet.userName(),
        faker.internet.password(7, true, /.*/, ""),
      ),
      faker.company.companyName(),
      //faker.internet.domainName() = serviceUrl
      faker.internet.domainName(),
      futureOwner ?? await FakeObjectGen.createFakeUser(),
    );
  }

  static async generateFakeUsers(count: number = 10): Promise<User[]> {
    const fakeUserList: User[] = [];
    for (let i = 0; i < count; i++) {
      const fakeUser = await FakeObjectGen.createFakeUser();
      fakeUserList.push(fakeUser);
    }
    return fakeUserList;
  }

  static async generateFakeGroups(
    userList: User[] = [],
    count: number = 10,
  ): Promise<Group[]> {
    const fakeGroupList: Group[] = [];
    for (let i = 0; i < count; i++) {
      const randomInt = Math.round(Math.random() * (userList.length - 1));

      const fakeUser = await FakeObjectGen.createFakeGroup(
        undefined,
        userList[randomInt],
      );
      fakeGroupList.push(fakeUser);
    }
    return fakeGroupList;
  }
  static async generateFakeServices(
    userList: ValidatedUser[] = [],
    count: number = 10,
  ): Promise<Service[]> {
    const fakeServiceList: Service[] = [];
    for (let i = 0; i < count; i++) {
      const randomInt = Math.round(Math.random() * (userList.length - 1));
      const fakeService = await FakeObjectGen.createFakeService(
        userList[randomInt],
      );
      fakeServiceList.push(fakeService);
    }
    return fakeServiceList;
  }
}
