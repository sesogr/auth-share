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
  database: "authshare",
  host: "localhost",
  username: "authshare",
  password: "5ES2#7PhHZplRm",
  port: 13006,
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

const { fakeUserList } = await buildUpUserRepo().then(async (f) => {
  await buildUpServRepo(f.fakeUserList.map((e) => e.convertToShort()));
  await buildUpGroupRepo(f.fakeUserList.map((e) => e.convertToShort()));
  return f;
});

Deno.test("DbUserRepository: hydrate", async () => {
  // Methode aufrufen und erwartetes Ergebnis überprüfen
  const userRepository: UserRepository & {
    hydrate: (id: string) => Promise<User>;
  } = new DbUserRepository();
  const fakeuser = fakeUserList[0];
  const user = await userRepository.hydrate(fakeuser.getId());
  assertInstanceOf(user, User);
  assertEquals(user.getId(), fakeuser.getId());
  assertEquals(user.getDisplayName(), fakeuser.getDisplayName());
  assertEquals(user.listServices().length, fakeuser.listServices().length);
  assertEquals(user.listServices()[0], fakeuser.listServices()[0]);
  assertEquals(
    user.listJoinedGroups().length,
    fakeuser.listJoinedGroups().length,
  );
  assertEquals(user.listJoinedGroups()[0], fakeuser.listJoinedGroups()[0]);
});

async function buildUpUserRepo() {
  const fakeUserList: User[] = FakeObjectGen.generateFakeUsers();
  const mockUserIdList: string[] = fakeUserList.map((e) => e.getId());
  const userRepository: UserRepository = new DbUserRepository();
  await Promise.all(fakeUserList.map((e) => userRepository.save(e))).then((e) =>
    console.log(e + "doneuser")
  ).catch((
    e,
  ) => console.log(e));
  return {
    mockUserIdList,
    userRepository,
    fakeUserList,
  };
}
async function buildUpServRepo(userList: ShortEntity[]) {
  const serviceList: Service[] = FakeObjectGen.generateFakeServices(userList);
  const serviceRepository: ServiceRepository = new DbServiceRepository();
  await Promise.all(serviceList.map((e) => serviceRepository.save(e))).then((
    e,
  ) => console.log(e + "doneserv")).catch((
    e,
  ) => console.log(e));
  return { serviceList, serviceRepository };
}
async function buildUpGroupRepo(userList: ShortEntity[]) {
  const groupList: Group[] = FakeObjectGen.generateFakeGroups(userList);
  const groupRepository = new DbGroupRepository();
  await Promise.all(groupList.map((e) => groupRepository.save(e))).then((e) =>
    console.log(e + "donegroup")
  ).catch((e) => console.log(e));
  return { groupList, groupRepository };
}
