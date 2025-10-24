import { Database, MySQLConnector } from "@denodb";
import { Group } from "../../src/classes/Group.ts";
import { DbGroupRepository } from "../../src/classes/Repositories/DenoDB/DbGroupRepository.ts";
import { DbServiceRepository } from "../../src/classes/Repositories/DenoDB/DbServiceRepository.ts";
import { DbUserRepository } from "../../src/classes/Repositories/DenoDB/DbUserRepository.ts";
import { DbGroup } from "../../src/classes/Repositories/DenoDB/Models/DbGroup.ts";
import { DbGroupService } from "../../src/classes/Repositories/DenoDB/Models/DbGroupService.ts";
import { DbIdDisplayname } from "../../src/classes/Repositories/DenoDB/Models/DbIdDisplayname.ts";
import { DbInvitation } from "../../src/classes/Repositories/DenoDB/Models/DbInvitation.ts";
import { DbService } from "../../src/classes/Repositories/DenoDB/Models/DbService.ts";
import { DbServiceCredential } from "../../src/classes/Repositories/DenoDB/Models/DbServiceCredentials.ts";
import { DbUser } from "../../src/classes/Repositories/DenoDB/Models/DbUser.ts";
import { DbUserCredential } from "../../src/classes/Repositories/DenoDB/Models/DbUserCredentials.ts";
import { DbUserGroup } from "../../src/classes/Repositories/DenoDB/Models/DbUserGroup.ts";
import { DbUserService } from "../../src/classes/Repositories/DenoDB/Models/DbUserService.ts";
import { setupManyToMany } from "../../src/classes/Repositories/DenoDB/Models/setupManyToMany.ts";
import { Service } from "../../src/classes/Service.ts";
import { User } from "../../src/classes/User.ts";
import { FakeObjectGen } from "../../src/FakeObjectGen.ts";
import { ServiceRepository } from "../../src/interfaceTypes/ServiceRepository.ts";
import { ShortEntity } from "../../src/interfaceTypes/ShortEntity.ts";
import { UserRepository } from "../../src/interfaceTypes/UserRepository.ts";
import { threadCpuUsage } from "node:process";
import { setMaxIdleHTTPParsers } from "node:http";

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

await buildUpUserRepo().then(async (f) => {
  await buildUpGroupRepo(f.fakeUserList.map((e) => e.convertToShort()));
  await buildUpServRepo(f.fakeUserList.map((e) => e.convertToShort()));
});
async function buildUpUserRepo() {
  const fakeUserList: User[] = FakeObjectGen.generateFakeUsers();
  const mockUserIdList: string[] = fakeUserList.map((e) => e.getId());
  const userRepository: UserRepository = new DbUserRepository();
  await Promise.all(fakeUserList.map(async (e) => {
    try {
      await userRepository.save(e);
      console.log(e.getId());
      return;
    } catch (error) {
      console.log(error);
    }
  }));
  await Deno.writeTextFile(
    "./service/test/testuser.json",
    JSON.stringify(fakeUserList),
  );
  return { mockUserIdList, fakeUserList };
}
async function buildUpServRepo(userList: ShortEntity[]) {
  const serviceList: Service[] = FakeObjectGen.generateFakeServices(userList);
  const serviceRepository: ServiceRepository = new DbServiceRepository();
  await Promise.all(
    serviceList.map(async (e) => await serviceRepository.save(e)),
  );
  Deno.writeTextFile(
    "./service/test/testservice.json",
    JSON.stringify(serviceList),
  );
  return { serviceList, serviceRepository };
}
async function buildUpGroupRepo(userList: ShortEntity[]) {
  const groupList: Group[] = FakeObjectGen.generateFakeGroups(userList);
  const groupRepository = new DbGroupRepository();
  await Promise.all(groupList.map(async (e) => await groupRepository.save(e)));
  Deno.writeTextFile(
    "./service/test/fakegroup.json",
    JSON.stringify(groupList),
  );
  return { groupList, groupRepository };
}
