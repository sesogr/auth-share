import { assertEquals, assertThrows } from "@std/assert";
import { InMemGroupRepository } from "../src/classes/Repositories/InMemGroupRepository.ts";
import { InMemServiceRepository } from "../src/classes/Repositories/InMemServiceRepository.ts";
import { InMemUserRepository } from "../src/classes/Repositories/InMemUserRepository.ts";
import { GroupRepository } from "../src/interfaceTypes/GroupRepository.ts";
import { ServiceRepository } from "../src/interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "../src/interfaceTypes/UserRepository.ts";
import { User } from "../src/classes/User.ts";
import { assertArrayIncludes } from "@std/assert";
import { FakeObjectGen } from "../src/FakeObjectGen.ts";
import { NotFoundError } from "../src/errors/NotFoundError.ts";
import { spy } from "@std/testing/mock";
import { AllowedGroupServiceMap } from "../src/classes/AllowedGroupServiceMap.ts";
import { AllowedUserGroupMap } from "../src/classes/AllowedUserGroupMap.ts";
import { AllowedUserServiceMap } from "../src/classes/AllowedUserServiceMap.ts";
import { UserCredential } from "../src/classes/UserCredential.ts";

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

Deno.test("Test for method removeById", () => {
  const serviceDatabase = {
    viewAllowedGroups: spy(() => {
      return [1, 2, 3, 4].map((e) =>
        new AllowedGroupServiceMap(e + "", e + "")
      );
    }),
    viewAllowedUser: spy(() => {
      return [1, 2, 3, 4].map((e) => new AllowedUserServiceMap(e + "", e + ""));
    }),
    viewInvitedGroups: spy(() => {
      return [];
    }),
  };
  const groupRepository = {
    viewAllowedUser: spy(() => {
      return [1, 2, 3, 4].map((e) => new AllowedUserGroupMap(e + "", e + ""));
    }),
    viewInvitations: spy(() => {
      return [];
    }),
  };
  const userRepository = new InMemUserRepository(
    serviceDatabase,
    groupRepository,
  );

  userRepository.save(new User(new UserCredential("", ""), "", "1"));
  //const deletedId = mockUserIdList[2];
  userRepository.findById("1");
  console.log(groupRepository.viewAllowedUser.call.length);
  assertEquals(groupRepository.viewAllowedUser.call.length, 1);
  assertEquals(groupRepository.viewAllowedUser.call.length, 0);
  userRepository.removeById("1");
  assertThrows(() => {
    userRepository.findById("1");
  });
});

/* wir brauchen für new inMemUserRepository const serviceRepository und const groupRepository
mit den typen groupRepositoryView und serviceRepositoryView und das für jeden test.
nur die UserRepository muss mit Mock daten Befüllt werden. */
