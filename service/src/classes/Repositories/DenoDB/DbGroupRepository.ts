import { GroupRepository } from "../../../interfaceTypes/GroupRepository.ts";
import { Group } from "../../Group.ts";
import { DbGroup } from "./Models/DbGroup.ts";
import { DbUserGroup } from "./Models/DbUserGroup.ts";
import { DbIdDisplayname } from "./Models/DbIdDisplayname.ts";
import { RuntimeError } from "../../../errors/RuntimeError.ts";
import { IdNameMap } from "../../IdNameMap.ts";
import { AllowedGroupServiceMap } from "../../AllowedGroupServiceMap.ts";
import { Invitation } from "../../Invitation.ts";
import { AllowedUserGroupMap } from "../../AllowedUserGroupMap.ts";

export class DbGroupRepository implements GroupRepository {
  async findByName(name: string): Promise<Group> {
    const searchedName = await DbGroup.where("groupname", name).first();
    return this.hydrate(searchedName.id?.toString() ?? "");
  }
  async hydrate(searchedId: string): Promise<Group> {
    const groupData = await DbGroup.where("id", searchedId).first();
    const groupname = groupData.groupname?.toString() ?? "";
    const groupOwnerData = await DbIdDisplayname.where(
      "id",
      groupData.owner?.toString() ?? "",
    ).first();
    const owner = new IdNameMap(
      groupOwnerData.id?.toString() ?? "",
      groupOwnerData.displayname?.toString() ?? "",
    );
    //
    const groupServiceData = await DbGroup.where("id", searchedId)
      .knownServices();

    const serviceList: AllowedGroupServiceMap[] = await Promise.all(
      groupServiceData.map(
        async (e) => {
          if (!e.service_id) {
            throw new Error("Expected for typesafety");
          }
          const serviceModel = await DbIdDisplayname.where(
            "id",
            e.service_id.toString(),
          )
            .select(
              "displayname",
            ).first();
          const serviceName = serviceModel.displayname;
          return new AllowedGroupServiceMap(
            new IdNameMap(searchedId, groupname.toString() ?? ""),
            new IdNameMap(
              e.service_id.toString(),
              serviceName?.toString() ?? "",
            ),
          );
        },
      ),
    );
    //SQL Query
    const userGroupData = await DbGroup.where("dbuser_id", searchedId)
      .authorizedUsers();
    const allowedUser: AllowedUserGroupMap[] = await Promise.all(
      userGroupData.map(
        async (e) => {
          const userShortModel = await DbIdDisplayname.where(
            "id",
            e.user_id?.toString() ?? "",
          )
            .select(
              "displayname",
            ).first();
          const userName = userShortModel.displayname;
          return new AllowedUserGroupMap(
            new IdNameMap(searchedId, groupname?.toString() ?? ""),
            new IdNameMap(
              e.user_id?.toString() ?? "",
              userName?.toString() ?? "",
            ),
            e.is_owner?.valueOf() as boolean ?? false,
          );
        },
      ),
    );
    const sentInvitations: Invitation[] = [];
    const serviceInvitations: Invitation[] = [];
    const group: Group = new Group(
      groupname,
      owner,
      searchedId,
      serviceList,
      sentInvitations,
      serviceInvitations,
      allowedUser,
    );
    return group;
  }
  async findOwnedByUserId(userId: string): Promise<Group[]> {
    const searchedList = await DbUserGroup.where({
      dbuser_id: userId,
      is_owner: true,
    }).get();

    if (Array.isArray(searchedList)) {
      const groups: Group[] = await Promise.all(searchedList.map((group) => {
        return this.hydrate(group.dbgroup_id?.toString() ?? "");
      }));
      return groups;
    }
    throw new RuntimeError();
  }
  async save(item: Group) {
    if (!(await DbGroup.find(item.getId()))) {
      this.add(item);
    }
  }
  async removeById(id: string): Promise<void> {
    await DbGroup.where("id", id).delete();
  }
  findById(id: string): Promise<Group> {
    return this.hydrate(id);
  }
  async findAll(): Promise<Group[]> {
    const all = DbGroup;
    const groups = await all.all();
    return Promise.all(
      groups.map((group) => {
        return this.hydrate(group.id?.toString() ?? "");
      }),
    );
  }
  async add(item: Group): Promise<void> {
    await DbGroup.create({
      groupname: item.getDisplayName(),
      owner: item.getOwner().id,
      id: item.getId(),
    });
    await DbUserGroup.create({
      dbuser_id: item.getOwner().id,
      dbgroup_id: item.getId(),
      isOwner: true,
    });
    await DbIdDisplayname.create({
      id: item.getId(),
      displayname: item.getDisplayName(),
    });
  }
}
