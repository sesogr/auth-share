import { spy } from "@std/testing/mock";
import { AllowedGroupServiceMap } from "../src/classes/AllowedGroupServiceMap.ts";
import { Invitation } from "../src/classes/Invitation.ts";
import { InMemGroupRepository } from "../src/classes/Repositories/InMem$Repositories/InMemGroupRepository.ts";
import { FakeObjectGen } from "../src/FakeObjectGen.ts";
import { ServiceRepositoryView } from "../src/interfaceTypes/ServiceRepositoryView.ts";
import { SpyObject } from "./HelperTypes.ts";
import { Group } from "../src/classes/Group.ts";
import { GroupRepository } from "../src/interfaceTypes/GroupRepository.ts";
import { assertEquals } from "@std/assert";
import { IdNameMap } from "../src/classes/IdNameMap.ts";

Deno.test("Group Repository", async (t) => {
  await t.step("findbyid", () => {
    const { groupList, groupRepository, serviceRepository }: GroupRepoTestsuit =
      buildUp();
    const testGroup = groupRepository.findById(groupList[0].getId());
    assertEquals(groupList[0].getId(), testGroup.getId());
    assertEquals(serviceRepository.viewInvitedGroups.calls.length, 1);
  });
});
type GroupRepoTestsuit = {
  groupList: Group[];
  groupRepository: GroupRepository;
  serviceRepository: SpyObject<ServiceRepositoryView>;
};

function buildUp(): GroupRepoTestsuit {
  const groupList: Group[] = FakeObjectGen.generateFakeGroups();
  const serviceRepository = createServiceRepository(groupList);
  const groupRepository = new InMemGroupRepository(
    serviceRepository,
  );
  groupList.forEach((e) => groupRepository.save(e));
  return { groupList, groupRepository, serviceRepository };
}

function createServiceRepository(
  groupList: Group[],
): SpyObject<ServiceRepositoryView> {
  const serviceDatabase: SpyObject<ServiceRepositoryView> = {
    viewAllowedGroups: spy(() => {
      return groupList.map((e, i) =>
        new AllowedGroupServiceMap(
          e.convertToShort(),
          new IdNameMap(i + "", ""),
        )
      );
    }),
    viewAllowedUser: spy(() => {
      throw new Error("Not your business");
    }),
    viewInvitedGroups: spy(() => {
      return groupList.map((e) =>
        new Invitation(
          FakeObjectGen.createFakeUser().convertToShort(),
          FakeObjectGen.createFakeService().convertToShort(),
          e.convertToShort(),
        )
      );
    }),
  };
  return serviceDatabase;
}
