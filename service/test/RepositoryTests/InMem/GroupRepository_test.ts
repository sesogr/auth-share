import { spy } from "@std/testing/mock";
import { AllowedGroupServiceMap } from "../../../src/classes/Values/AllowedGroupServiceMap.ts";
import { Invitation } from "../../../src/classes/Values/Invitation.ts";
import { InMemGroupRepository } from "../../../src/classes/Repositories/InMem$Repositories/InMemGroupRepository.ts";
import { FakeObjectGen } from "../../../src/classes/FakeObjectGen.ts";
import { ServiceAggregateView } from "../../../interfaceTypes/ServiceAggregateView.ts";
import { SpyObject } from "../../HelperTypes.ts";
import { Group } from "../../../src/classes/Entities/Group.ts";
import { GroupRepository } from "../../../interfaceTypes/GroupRepository.ts";
import { assertArrayIncludes, assertEquals, assertThrows } from "@std/assert";
import { IdNameMap } from "../../../src/classes/Values/IdNameMap.ts";
import { NotFoundError } from "../../../src/classes/errors/NotFoundError.ts";
import { AlreadyTakenError } from "../../../src/classes/errors/controllerErrors/ConflictError/AlreadyTakenError.ts";
import { AllowedUserGroupMap } from "../../../src/classes/Values/AllowedUserGroupMap.ts";
import { User } from "../../../src/classes/Entities/User.ts";
import { UserCredential } from "../../../src/classes/Values/UserCredential.ts";
import { Service } from "../../../src/classes/Entities/Service.ts";
import { ServiceCredential } from "../../../src/classes/Values/ServiceCredential.ts";

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
      }, AlreadyTakenError);
    });
    await st.step("correct save", async (sst) => {
      const idmap1 = await FakeObjectGen.createFakeUser();
      const idmap2 = await FakeObjectGen.createFakeUser();
      await sst.step("Invitations", async () => {
        const invitation: Invitation = new Invitation(
          idmap1.convertToShort(),
          groupList[0].convertToShort(),
          idmap2.convertToShort(),
          "group",
        );
        groupList[0].sendInvitation(
          idmap1,
          idmap2,
        );
        await groupRepository.save(groupList[0]);
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
        await groupRepository.save(currGroup);
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
  return {
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
          "service",
        );
      });
    }),
  };
}
