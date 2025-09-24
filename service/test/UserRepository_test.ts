//von der user repo ein user findet/bekommt -->
//servicerepo test
//test für findbyid => alle properties nicht logisch falsch sind

import { assertEquals, assertGreater } from "@std/assert";
import { InMemGroupRepository } from "../src/classes/Repositories/InMemGroupRepository.ts";
import { InMemServiceRepository } from "../src/classes/Repositories/InMemServiceRepository.ts";
import { InMemUserRepository } from "../src/classes/Repositories/InMemUserRepository.ts";
import { GroupRepository } from "../src/interfaceTypes/GroupRepository.ts";
import { ServiceRepository } from "../src/interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "../src/interfaceTypes/UserRepository.ts";
import { User } from "../src/classes/User.ts";

const serviceRepository: ServiceRepository = new InMemServiceRepository();
const groupRepository: GroupRepository = new InMemGroupRepository(
  serviceRepository,
);
const userRepository: UserRepository = new InMemUserRepository(
  serviceRepository,
  groupRepository,
);

userRepository.fillWithMockData();
const mockUserList: string[] = userRepository.findAll().map((e) => e.getId());
serviceRepository.fillWithMockData(mockUserList);

groupRepository.fillWithMockData(mockUserList);

Deno.test("Test for method findById()", () => {
  const userList: User[] = userRepository.findAll();
  assertGreater(userList.length, 0);

  const userId: string = userList[0].getId();
  const user = userRepository.findById(userId);

  assertEquals(user.getId(), userId);
});

Deno.test("Test for method findByName()", () => {
  const userList: User[] = userRepository.findAll();
  assertGreater(userList.length, 3);

  const userName: string = userList[3].getDisplayName();
  const toCheck: string = userRepository.findByName(userName).getDisplayName();

  assertEquals(toCheck, userName);
});
