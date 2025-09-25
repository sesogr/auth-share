import { assertEquals, assertThrows } from "@std/assert";
import { InMemUserRepository } from "../src/classes/Repositories/InMemUserRepository.ts";
import { UserRepository } from "../src/interfaceTypes/UserRepository.ts";
import { User } from "../src/classes/User.ts";
import { FakeObjectGen } from "../src/FakeObjectGen.ts";
import { NotFoundError } from "../src/errors/NotFoundError.ts";
import { spy } from "@std/testing/mock";
import { AllowedUserGroupMap } from "../src/classes/AllowedUserGroupMap.ts";
import { AllowedUserServiceMap } from "../src/classes/AllowedUserServiceMap.ts";

function createServiceDatabase(userIdList: string[]) {
  const serviceDatabase = {
    viewAllowedGroups: spy(() => {
      throw new Error("Not your business");
    }),
    viewAllowedUser: spy(() => {
      return userIdList.map((e, i) =>
        new AllowedUserServiceMap(e + "", i + "")
      );
    }),
    viewInvitedGroups: spy(() => {
      throw new Error("Not your business");
    }),
  };
  return serviceDatabase;
}
function createGroupRepository(userIdList: string[]) {
  const groupRepository = {
    viewAllowedUser: spy(() => {
      return userIdList.map((e, i) => new AllowedUserGroupMap(e + "", i + ""));
    }),
    viewInvitations: spy(() => {
      return [];
    }),
  };
  return groupRepository;
}

function fillWithMockUserData(): User[] {
  const fakeUserList: User[] = [];
  for (let i = 0; i < 10; i++) {
    const fakeUser = FakeObjectGen.createFakeUser();
    fakeUserList.push(fakeUser);
  }
  return fakeUserList;
}

Deno.test("Test for method findById()", () => {
  const fakeUserList: User[] = fillWithMockUserData();
  const mockUserIdList: string[] = fakeUserList.map((e) => e.getId());
  const serviceDatabase = createServiceDatabase(mockUserIdList);
  const groupRepository = createGroupRepository(mockUserIdList);
  const userRepository: UserRepository = new InMemUserRepository(
    serviceDatabase,
    groupRepository,
  );
  fakeUserList.forEach((e) => userRepository.save(e));

  const userId: string = mockUserIdList[0];
  const expectedId: string = mockUserIdList[0];

  const user = userRepository.findById(userId);
  assertEquals(user.getId(), expectedId);
  assertEquals(serviceDatabase.viewAllowedUser.calls.length, 1);
  assertEquals(groupRepository.viewAllowedUser.calls.length, 1);
  assertEquals(user.getDisplayName(), fakeUserList[0].getDisplayName());
  assertEquals(user.listServices(), ["0"]);
  assertEquals(user.listJoinedGroups(), ["0"]);
});

Deno.test("Test for method findByName()", () => {
  const fakeUserList: User[] = fillWithMockUserData();
  const mockUserIdList: string[] = fakeUserList.map((e) => e.getId());
  const serviceDatabase = createServiceDatabase(mockUserIdList);
  const groupRepository = createGroupRepository(mockUserIdList);
  const userRepository: UserRepository = new InMemUserRepository(
    serviceDatabase,
    groupRepository,
  );
  fakeUserList.forEach((e) => userRepository.save(e));
  //changing index of the fakeUserList > 9 => Test failed
  const userName: string = fakeUserList[9].getDisplayName();
  const toCheck: string = userRepository.findByName(userName).getDisplayName();

  assertEquals(toCheck, userName);
});

Deno.test("Test for method findAll()", () => {
  const fakeUserList: User[] = fillWithMockUserData();
  const mockUserIdList: string[] = fakeUserList.map((e) => e.getId());
  const serviceDatabase = createServiceDatabase(mockUserIdList);
  const groupRepository = createGroupRepository(mockUserIdList);
  const userRepository: UserRepository = new InMemUserRepository(
    serviceDatabase,
    groupRepository,
  );
  fakeUserList.forEach((e) => userRepository.save(e));

  const userList: User[] = userRepository.findAll();
  const userIdList: string[] = userList.map((e) => e.getId());
  assertEquals(userIdList, mockUserIdList);
});

Deno.test("Test for method removeById", () => {
  const fakeUserList: User[] = fillWithMockUserData();
  const mockUserIdList: string[] = fakeUserList.map((e) => e.getId());
  const serviceDatabase = createServiceDatabase(mockUserIdList);
  const groupRepository = createGroupRepository(mockUserIdList);
  const userRepository: UserRepository = new InMemUserRepository(
    serviceDatabase,
    groupRepository,
  );
  fakeUserList.forEach((e) => userRepository.save(e));

  const deletedId = mockUserIdList[0];
  userRepository.removeById(deletedId);
  assertThrows(() => {
    userRepository.findById(deletedId);
  }, NotFoundError);
});
