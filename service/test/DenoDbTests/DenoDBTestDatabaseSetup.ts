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
import { UserRepository } from "../../src/interfaceTypes/UserRepository.ts";

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
function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
const groupsWithService = async () => {
  const fakeUser = FakeObjectGen.createFakeUser();
  const fakeService = FakeObjectGen.createFakeService(
    fakeUser,
  );

  const fakeGroups: Group[] = [];

  for (let i = 0; i < 10; i++) {
    const group = FakeObjectGen.createFakeGroup(
      undefined,
      fakeUser,
    );
    fakeService.giveAuthorizationToGroup(group);

    fakeGroups.push(group);
  }
  const serviceRepo = new DbServiceRepository();
  const groupRepo = new DbGroupRepository();
  const userRepo = new DbUserRepository();

  await userRepo.save(fakeUser);
  await groupRepo.saveAll(fakeGroups);
  await serviceRepo.save(fakeService);
  await db.close();
};

const { fakeUserList } = await buildUpUserRepo();

sleep(2500).then(async () => {
  await buildUpGroupRepo(fakeUserList);
});
sleep(2500).then(async () => {
  await buildUpServRepo(fakeUserList);
});

await groupsWithService();

async function buildUpUserRepo() {
  const fakeUserList: User[] = FakeObjectGen.generateFakeUsers();
  const mockUserIdList: string[] = fakeUserList.map((e) => e.getId());
  const userRepository: UserRepository = new DbUserRepository();
  await Promise.all(fakeUserList.map(async (e) => {
    try {
      await userRepository.add(e);
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
async function buildUpServRepo(userList: User[]) {
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
async function buildUpGroupRepo(userList: User[]) {
  const groupList: Group[] = FakeObjectGen.generateFakeGroups(userList);
  const groupRepository = new DbGroupRepository();
  await Promise.all(groupList.map(async (e) => await groupRepository.save(e)));
  Deno.writeTextFile(
    "./service/test/fakegroup.json",
    JSON.stringify(groupList),
  );
  return { groupList, groupRepository };
}
