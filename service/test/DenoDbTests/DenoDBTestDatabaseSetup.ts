import { Database, MySQLConnector } from "@denodb";
import { Group } from "../../src/classes/Entities/Group.ts";
import { DbGroupRepository } from "../../src/classes/Repositories/DenoDB/DbGroupRepository.ts";
import { DbServiceRepository } from "../../src/classes/Repositories/DenoDB/DbServiceRepository.ts";
import { DbUserRepository } from "../../src/classes/Repositories/DenoDB/DbUserRepository.ts";
import { DbGroup } from "../../src/classes/Repositories/DenoDB/Models/DbGroup.ts";
import { DbGroupService } from "../../src/classes/Repositories/DenoDB/Models/DbGroupService.ts";
import { DbInvitation } from "../../src/classes/Repositories/DenoDB/Models/DbInvitation.ts";
import { DbService } from "../../src/classes/Repositories/DenoDB/Models/DbService.ts";
import { DbServiceCredential } from "../../src/classes/Repositories/DenoDB/Models/DbServiceCredentials.ts";
import { DbUser } from "../../src/classes/Repositories/DenoDB/Models/DbUser.ts";
import { DbUserCredential } from "../../src/classes/Repositories/DenoDB/Models/DbUserCredentials.ts";
import { DbUserGroup } from "../../src/classes/Repositories/DenoDB/Models/DbUserGroup.ts";
import { DbUserService } from "../../src/classes/Repositories/DenoDB/Models/DbUserService.ts";
import { setupManyToMany } from "../../src/classes/Repositories/DenoDB/Models/setupManyToMany.ts";
import { Service } from "../../src/classes/Entities/Service.ts";
import { User } from "../../src/classes/Entities/User.ts";
import { FakeObjectGen } from "../FakeObjectGen.ts";
import { ServiceRepository } from "../../interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "../../interfaceTypes/UserRepository.ts";
import { DbSessions } from "../../src/classes/Repositories/DenoDB/Models/DbSessions.ts";
import { RamOnlyLog } from "../RamOnlyLog.ts";

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
  DbSessions,
]);

await db.sync({ drop: true });

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const logger = new RamOnlyLog();
const groupsWithService = async () => {
  const fakeUser = await FakeObjectGen.createFakeUser();
  const fakeService = await FakeObjectGen.createFakeService(
    fakeUser,
  );

  const fakeGroups: Group[] = [];

  for (let i = 0; i < 10; i++) {
    const group = await FakeObjectGen.createFakeGroup(
      undefined,
      fakeUser,
    );
    fakeService.giveAuthorizationToGroup(group);

    fakeGroups.push(group);
  }
  const serviceRepo = new DbServiceRepository(logger);
  const groupRepo = new DbGroupRepository(logger);
  const userRepo = new DbUserRepository(logger);

  await userRepo.save(fakeUser);
  await groupRepo.saveAll(fakeGroups);
  await serviceRepo.save(fakeService);
  await db.close();
};
const { fakeUserList } = await buildUpUserRepo();

console.log();
await buildUpServRepo(fakeUserList);

await buildUpGroupRepo(fakeUserList);
await groupsWithService();
sleep(2500).then(async () => {
  await db.close();
});

async function buildUpUserRepo() {
  const fakeUserList: User[] = await FakeObjectGen.generateFakeUsers();
  const mockUserIdList: string[] = fakeUserList.map((e) => e.getId());
  const userRepository: UserRepository = new DbUserRepository(logger);
  await Promise.all(fakeUserList.map(async (e) => {
    try {
      await userRepository.add(e);
      console.log(e.getId());
      return;
    } catch (error) {
      console.log(error);
    }
  }));

  return { mockUserIdList, fakeUserList };
}

async function buildUpServRepo(userList: User[]) {
  const serviceList: Service[] = await FakeObjectGen.generateFakeServices(
    userList,
  );
  const serviceRepository: ServiceRepository = new DbServiceRepository(logger);
  await Promise.all(
    serviceList.map(async (e) => await serviceRepository.save(e)),
  );

  return { serviceList, serviceRepository };
}

async function buildUpGroupRepo(userList: User[]) {
  const groupList: Group[] = await FakeObjectGen.generateFakeGroups(userList);
  const groupRepository = new DbGroupRepository(logger);

  await Promise.all(groupList.map(async (e) => await groupRepository.save(e)));
  return { groupList, groupRepository };
}
