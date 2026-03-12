import { assertEquals, assertThrows } from "@std/assert";
import { InMemUserRepository } from "../../../src/classes/Repositories/InMem$Repositories/InMemUserRepository.ts";
import { UserRepository } from "../../../src/interfaceTypes/UserRepository.ts";
import { User } from "../../../src/classes/User.ts";
import { FakeObjectGen } from "../../../src/FakeObjectGen.ts";
import { NotFoundError } from "../../../src/errors/NotFoundError.ts";
import { spy } from "@std/testing/mock";
import { AllowedUserGroupMap } from "../../../src/classes/AllowedUserGroupMap.ts";
import { AllowedUserServiceMap } from "../../../src/classes/AllowedUserServiceMap.ts";
import { ServiceAggregateView } from "../../../src/interfaceTypes/ServiceAggregateView.ts";
import { GroupAggregateView } from "../../../src/interfaceTypes/GroupAggregateView.ts";
import { SpyObject } from "../../HelperTypes.ts";
import { IdNameMap } from "../../../src/classes/IdNameMap.ts";

Deno.test("UserRepository", async (t) => {
  await t.step("Test for method findById()", async () => {
    const {
      mockUserIdList,
      userRepository,
      serviceRepository,
      groupRepository,
      fakeUserList,
    }: UserRepoTestSuit = await buildUp();

    const userId: string = mockUserIdList[0];
    const expectedId: string = mockUserIdList[0];

    const user = await userRepository.findById(userId);
    assertEquals(user.getId(), expectedId);
    assertEquals(serviceRepository.viewAllowedUser.calls.length, 1);
    assertEquals(groupRepository.viewAllowedUser.calls.length, 1);
    assertEquals(user.getDisplayName(), fakeUserList[0].getDisplayName());
    assertEquals(user.listServices(), ["0"]);
    assertEquals(user.listJoinedGroups(), ["0"]);
  });

  await t.step("Test for method findByName()", async () => {
    const { fakeUserList, userRepository }: UserRepoTestSuit = await buildUp();
    //changing index of the fakeUserList > 9 => Test failed
    const userName: string = fakeUserList[9].getDisplayName();
    const toCheck: string = (await userRepository.findByDisplayName(userName))
      .getDisplayName();

    assertEquals(toCheck, userName);
  });

  await t.step("Test for method findAll()", async () => {
    const { userRepository, mockUserIdList }: UserRepoTestSuit =
      await buildUp();
    const userList: User[] = await userRepository.findAll();
    const userIdList: string[] = userList.map((e) => e.getId());
    assertEquals(userIdList, mockUserIdList);
  });

  await t.step("Test for method removeById", async () => {
    const { mockUserIdList, userRepository }: UserRepoTestSuit =
      await buildUp();
    const deletedId = mockUserIdList[0];
    await userRepository.removeById(deletedId);
    assertThrows(() => {
      userRepository.findById(deletedId);
    }, NotFoundError);
  });
});

async function buildUp(): Promise<UserRepoTestSuit> {
  const fakeUserList: User[] = await FakeObjectGen.generateFakeUsers();
  const mockUserIdList: string[] = fakeUserList.map((e) => e.getId());
  const serviceRepository: SpyObject<ServiceAggregateView> =
    createServiceRepository(mockUserIdList);
  const groupRepository: SpyObject<GroupAggregateView> = createGroupRepository(
    mockUserIdList,
  );
  const userRepository: UserRepository = new InMemUserRepository(
    serviceRepository,
    groupRepository,
  );
  await Promise.all(
    fakeUserList.map(async (e) => await userRepository.save(e)),
  );
  return {
    mockUserIdList,
    userRepository,
    serviceRepository,
    groupRepository,
    fakeUserList,
  };
}

function createServiceRepository(
  userIdList: string[],
): SpyObject<ServiceAggregateView> {
  return {
    viewAllowedGroups: spy(() => {
      throw new Error("Not your business");
    }),
    viewAllowedUser: spy(() => {
      return userIdList.map((e, i) =>
        new AllowedUserServiceMap(
          new IdNameMap(e + "", e + ""),
          new IdNameMap(i + "", i + ""),
        )
      );
    }),
    viewInvitedGroups: spy(() => {
      throw new Error("Not your business");
    }),
  };
}

function createGroupRepository(
  userIdList: string[],
): SpyObject<GroupAggregateView> {
  return {
    viewAllowedUser: spy(() => {
      return userIdList.map((e, i) =>
        new AllowedUserGroupMap(
          new IdNameMap(e + "", e + ""),
          new IdNameMap(i + "", i + ""),
        )
      );
    }),
    viewInvitations: spy(() => {
      return [];
    }),
  };
}

type UserRepoTestSuit = {
  mockUserIdList: string[];
  userRepository: UserRepository;
  serviceRepository: SpyObject<ServiceAggregateView>;
  groupRepository: SpyObject<GroupAggregateView>;
  fakeUserList: User[];
};
