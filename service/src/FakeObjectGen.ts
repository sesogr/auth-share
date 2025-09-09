import { faker } from "jsr:@jackfiszr/faker@1.1.6";
import { User } from "./classes/User.ts";
import { UserCredential } from "./classes/UserCredential.ts";
import { Group } from "./classes/Group.ts";
import { Service } from "./classes/Service.ts";
import { ServiceCredential } from "./classes/ServiceCredential.ts";
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
    user: User = FakeObjectGen.createFakeUser(),
  ) {
    return Group.createUserGroup(groupDisplayName, user);
  }
  static createFakeService(futureOwner: User = FakeObjectGen.createFakeUser()) {
    return Service.createService(
      new ServiceCredential(
        faker.internet.userName(),
        faker.internet.password(7, true, /.*/, ""),
      ),
      faker.internet.domainName(),
      futureOwner,
    );
  }
}
