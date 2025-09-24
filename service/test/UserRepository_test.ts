import { assertEquals, assertThrows } from "@std/assert";
import { InMemGroupRepository } from "../src/classes/Repositories/InMemGroupRepository.ts";
import { InMemServiceRepository } from "../src/classes/Repositories/InMemServiceRepository.ts";
import { InMemUserRepository } from "../src/classes/Repositories/InMemUserRepository.ts";
import { GroupRepository } from "../src/interfaceTypes/GroupRepository.ts";
import { ServiceRepository } from "../src/interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "../src/interfaceTypes/UserRepository.ts";
import { User } from "../src/classes/User.ts";
import { assertArrayIncludes } from "https://deno.land/std@0.224.0/assert/assert_array_includes.ts";
import { FakeObjectGen } from "../src/FakeObjectGen.ts";
import { NotFoundError } from "../src/errors/NotFoundError.ts";

const serviceRepository: ServiceRepository = new InMemServiceRepository();
const groupRepository: GroupRepository = new InMemGroupRepository(
  serviceRepository,
);
const userRepository: UserRepository = new InMemUserRepository(
  serviceRepository,
  groupRepository,
);
function fillWithMockGroupData(userIdList: string[]): void {
  for (let i = 0; i < 5; i++) {
    const rand = Math.round(Math.random() * userIdList.length);
    const fakeGroup = FakeObjectGen.createFakeGroup(
      undefined,
      userIdList[rand],
    );
    groupRepository.save(fakeGroup);
  }
}
function fillWithMockServiceData(userIdList: string[]): void {
  for (let i = 0; i < 10; i++) {
    const rand = Math.round(Math.random() * userIdList.length);
    const fakeService = FakeObjectGen.createFakeService(userIdList[rand]);
    serviceRepository.save(fakeService);
  }
}

function fillWithMockUserData(): User[] {
  const fakeUserList: User[] = [];
  for (let i = 0; i < 10; i++) {
    const fakeUser = FakeObjectGen.createFakeUser();
    fakeUserList.push(fakeUser);
    userRepository.save(fakeUser);
  }
  return fakeUserList;
}
const fakeUserList: User[] = fillWithMockUserData();

const mockUserIdList: string[] = fakeUserList.map((e) => e.getId());
fillWithMockServiceData(mockUserIdList);
fillWithMockGroupData(mockUserIdList);

Deno.test("Test for method findById()", () => {
  const userId: string = mockUserIdList[0];
  const user = userRepository.findById(userId);

  assertEquals(user.getId(), userId);
});

Deno.test("Test for method findByName()", () => {
  const userName: string = fakeUserList[3].getDisplayName();
  const toCheck: string = userRepository.findByName(userName).getDisplayName();

  assertEquals(toCheck, userName);
});

Deno.test("Test for method findAll()", () => {
  const userList: User[] = userRepository.findAll();
  assertArrayIncludes(userList, fakeUserList);
});

Deno.test("Test for method removeById", () => {
  const deletedId = mockUserIdList[2];
  userRepository.removeById(deletedId);
  assertThrows(() => {
    userRepository.findById(deletedId);
  }, NotFoundError);
});
