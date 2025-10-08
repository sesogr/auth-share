import { GroupRepository } from "../../../interfaceTypes/GroupRepository.ts";
import { Group } from "../../Group.ts";
import { DbGroup } from "./Models/DbGroup.ts";
import { DbUserGroup } from "./Models/DbUserGroup.ts";
import { DbIdDisplayname } from "./Models/DbIdDisplayname.ts";
import { RuntimeError } from "../../../errors/RuntimeError.ts";

export class DbGroupRepository implements GroupRepository {
  async findByName(name: string): Promise<Group> {
    const searchedName = await DbGroup.where("groupname", name).first();
    return this.hydrate(searchedName.id?.toString() ?? "");
  }
  hydrate(_group_id: string): Promise<Group> {
    // const groupData = await DbGroup.where("id", group_id).first();
    // const groupname = groupData.groupname?.toString() ?? "";
    // const groupOwnerData = await DbIdDisplayname.where(
    //   "id",
    //   groupData.owner?.toString() ?? "",
    // ).first();
    // const owner = new IdNameMap(
    //   groupOwnerData.id?.toString() ?? "",
    //   groupOwnerData.displayname?.toString() ?? "",
    // );
    // //
    // const serviceList = await DbGroup.where();
    // const group: Group = new Group(
    //   groupname,
    //   owner,
    //   group_id,
    //   serviceList,
    //   sentInvitations,
    //   serviceInvitations,
    //   allowedUser,
    // );
    // return group;
    throw new RuntimeError();
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
