import { spy } from "@std/testing/mock";
import { AllowedGroupServiceMap } from "../../../src/classes/AllowedGroupServiceMap.ts";
import { Invitation } from "../../../src/classes/Invitation.ts";
import { InMemGroupRepository } from "../../../src/classes/Repositories/InMem$Repositories/InMemGroupRepository.ts";
import { FakeObjectGen } from "../../../src/FakeObjectGen.ts";
import { ServiceAggregateView } from "../../../src/interfaceTypes/ServiceAggregateView.ts";
import { SpyObject } from "../../HelperTypes.ts";
import { Group } from "../../../src/classes/Group.ts";
import { GroupRepository } from "../../../src/interfaceTypes/GroupRepository.ts";
import { assertArrayIncludes, assertEquals, assertThrows } from "@std/assert";
import { IdNameMap } from "../../../src/classes/IdNameMap.ts";
import { NotFoundError } from "../../../src/errors/NotFoundError.ts";
import { ItemAlreadyExistsError } from "../../../src/errors/ItemAlreadyExistsError.ts";
import { AllowedUserGroupMap } from "../../../src/classes/AllowedUserGroupMap.ts";
import { User } from "../../../src/classes/User.ts";
import { UserCredential } from "../../../src/classes/UserCredential.ts";
import { Service } from "../../../src/classes/Service.ts";
import { ServiceCredential } from "../../../src/classes/ServiceCredential.ts";

Deno.test("Group Repository", async (t) => {
  await t.step("findbyid", async (st) => {
    const { groupList, groupRepository, serviceRepository }: GroupRepoTestsuit =
      await buildUp();
    await st.step("correct find", async () => {
      const testGroup = await groupRepository.findById(groupList[0].getId());
      assertEquals(groupList[0].getId(), testGroup.getId());
      assertEquals(serviceRepository.viewInvitedGroups.calls.length, 1);
    });
    await st.step("correct throw", () => {
      assertThrows(() => {
        groupRepository.findById("ahdfh");
      }, NotFoundError);
    });
  });
  await t.step("save", async (st) => {
    const { groupList, groupRepository }: GroupRepoTestsuit = await buildUp();
    await st.step("add fails for duplicates", () => {
      assertThrows(() => {
        groupRepository.add(groupList[0]);
      }, ItemAlreadyExistsError);
    });
    await st.step("correct save", async (sst) => {
      const idmap1: User = await FakeObjectGen.createFakeUser();
      const idmap2: User = await FakeObjectGen.createFakeUser();
      await sst.step("Invitations", async () => {
        const invitation: Invitation = new Invitation(
          idmap1.convertToShort(),
          groupList[0].convertToShort(),
          idmap2.convertToShort(),
        );
        groupList[0].sendInvitation(
          idmap1,
          idmap2,
        );
        groupRepository.save(groupList[0]);
        const savedGroup: Group = await groupRepository.findById(
          groupList[0].getId(),
        );
        assertArrayIncludes(savedGroup.listSentInvitation(), [invitation]);
      });
      await sst.step("authorized map", async () => {
        const currGroup = groupList[0];
        const authorizedUsers = new AllowedUserGroupMap(
          idmap1.convertToShort(),
          currGroup.convertToShort(),
        );
        currGroup.giveAuthorizationToUser(idmap1);
        groupRepository.save(currGroup);
        const savedGroup = await groupRepository.findById(currGroup.getId());
        assertArrayIncludes(savedGroup.allowedUser, [authorizedUsers]);
      });
    });
  });
});
type GroupRepoTestsuit = {
  groupList: Group[];
  groupRepository: GroupRepository;
  serviceRepository: SpyObject<ServiceAggregateView>;
};

async function buildUp(): Promise<GroupRepoTestsuit> {
  const groupList: Group[] = await FakeObjectGen.generateFakeGroups();
  const serviceRepository = createServiceRepository(groupList);
  const groupRepository = new InMemGroupRepository(
    serviceRepository,
  );
  await Promise.all(groupList.map(async (e) => await groupRepository.save(e)));
  return { groupList, groupRepository, serviceRepository };
}

function createServiceRepository(
  groupList: Group[],
): SpyObject<ServiceAggregateView> {
  const serviceDatabase: SpyObject<ServiceAggregateView> = {
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
      return groupList.map((e) => {
        const user = User.createUser(new UserCredential("", "", ""), "");
        const service = Service.createService(
          new ServiceCredential("", ""),
          "",
          "",
          user,
        ).convertToShort();
        return new Invitation(
          user.convertToShort(),
          service,
          e.convertToShort(),
        );
      });
    }),
  };
  return serviceDatabase;
}
