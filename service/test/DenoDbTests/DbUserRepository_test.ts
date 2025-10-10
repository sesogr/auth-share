import { DbUserRepository } from "../../src/classes/Repositories/DenoDB/DbUserRepository.ts";
import { assertEquals, assertInstanceOf } from "@std/assert";
import { User } from "../../src/classes/User.ts";
import { UserRepository } from "../../src/interfaceTypes/UserRepository.ts";
import { Database, MySQLConnector } from "@denodb";
import { DbGroup } from "../../src/classes/Repositories/DenoDB/Models/DbGroup.ts";
import {
  DbGroupService,
} from "../../src/classes/Repositories/DenoDB/Models/DbGroupService.ts";
import { DbIdDisplayname } from "../../src/classes/Repositories/DenoDB/Models/DbIdDisplayname.ts";
import { DbInvitation } from "../../src/classes/Repositories/DenoDB/Models/DbInvitation.ts";
import { DbService } from "../../src/classes/Repositories/DenoDB/Models/DbService.ts";
import { DbServiceCredential } from "../../src/classes/Repositories/DenoDB/Models/DbServiceCredentials.ts";
import { DbUser } from "../../src/classes/Repositories/DenoDB/Models/DbUser.ts";
import { DbUserCredential } from "../../src/classes/Repositories/DenoDB/Models/DbUserCredentials.ts";
import {
  DbUserGroup,
} from "../../src/classes/Repositories/DenoDB/Models/DbUserGroup.ts";
import {
  DbUserService,
} from "../../src/classes/Repositories/DenoDB/Models/DbUserService.ts";
import { FakeObjectGen } from "../../src/FakeObjectGen.ts";
import { Service } from "../../src/classes/Service.ts";
import { ServiceRepository } from "../../src/interfaceTypes/ServiceRepository.ts";
import { DbGroupRepository } from "../../src/classes/Repositories/DenoDB/DbGroupRepository.ts";
import { Group } from "../../src/classes/Group.ts";
import { DbServiceRepository } from "../../src/classes/Repositories/DenoDB/DbServiceRepository.ts";
import { ShortEntity } from "../../src/interfaceTypes/ShortEntity.ts";
import { setupManyToMany } from "../../src/classes/Repositories/DenoDB/Models/setupManyToMany.ts";
const connector = new MySQLConnector({
  database: Deno.env.get("DB_NAME")!,
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
});
const db = new Database(connector);
setupManyToMany();
db.link([
  DbUser,
  DbService,
  DbGroup,
  DbUserService,
  DbUserCredential,
  DbServiceCredential,
  DbUserGroup,
  DbGroupService,
  DbInvitation,
  DbIdDisplayname,
]);

await db.sync({ drop: true });

const { fakeUserList } = buildUpUserRepo();
buildUpServRepo(fakeUserList.map((e) => e.convertToShort()));
buildUpGroupRepo(fakeUserList.map((e) => e.convertToShort()));

Deno.test("DbUserRepository: hydrate", async () => {
  // Methode aufrufen und erwartetes Ergebnis überprüfen
  const userRepository: UserRepository & {
    hydrate: (id: string) => Promise<User>;
  } = new DbUserRepository();
  const user = await userRepository.hydrate("testID1");
  assertInstanceOf(user, User);
  assertEquals(user.getId(), "testID1");
  assertEquals(user.getDisplayName(), "Hans Meiser");
  assertEquals(user.listServices().length, 1);
  assertEquals(user.listServices()[0], "MyService");
  assertEquals(user.listJoinedGroups().length, 1);
  assertEquals(user.listJoinedGroups()[0], "TestGroup1");
});

function buildUpUserRepo() {
  const fakeUserList: User[] = FakeObjectGen.generateFakeUsers();
  const mockUserIdList: string[] = fakeUserList.map((e) => e.getId());
  const userRepository: UserRepository = new DbUserRepository();
  fakeUserList.forEach((e) => userRepository.save(e));
  return {
    mockUserIdList,
    userRepository,
    fakeUserList,
  };
}
function buildUpServRepo(userList: ShortEntity[]) {
  const serviceList: Service[] = FakeObjectGen.generateFakeServices(userList);
  const serviceRepository: ServiceRepository = new DbServiceRepository();
  serviceList.forEach((e) => serviceRepository.save(e));
  return { serviceList, serviceRepository };
}
function buildUpGroupRepo(userList: ShortEntity[]) {
  const groupList: Group[] = FakeObjectGen.generateFakeGroups(userList);
  const groupRepository = new DbGroupRepository();
  groupList.forEach((e) => groupRepository.save(e));
  return { groupList, groupRepository };
}
