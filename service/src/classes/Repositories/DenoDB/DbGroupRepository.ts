import { GroupRepository } from "../../../interfaceTypes/GroupRepository.ts";
import { Group } from "../../Group.ts";
import { DbGroup } from "./Models/DbGroup.ts";
import { DbUserGroup } from "./Models/DbUserGroup.ts";
import {
  DbIdDisplayname,
  DbIdDisplaynameInvitations2Sender,
  DbIdDisplaynameInvitationsObj,
  DbIdDisplaynameInvitationsReceiver,
  DbIdDisplaynameInvitationsSender,
  DbIdDisplaynameService,
  DbIdDisplaynameUser,
} from "./Models/DbIdDisplayname.ts";
import { RuntimeError } from "../../../errors/RuntimeError.ts";
import { IdNameMap } from "../../IdNameMap.ts";
import { AllowedGroupServiceMap } from "../../AllowedGroupServiceMap.ts";
import { Invitation } from "../../Invitation.ts";
import { AllowedUserGroupMap } from "../../AllowedUserGroupMap.ts";
import { Model } from "@denodb";
import { NotFoundError } from "../../../errors/NotFoundError.ts";
import { DbGroupService } from "./Models/DbGroupService.ts";
import {
  DbInvitationJoinOnObject,
  DbInvitationJoinOnReceived,
} from "./Models/DbInvitation.ts";
import { ShortEntity } from "../../../interfaceTypes/ShortEntity.ts";

export class DbGroupRepository implements GroupRepository {
  async findByName(name: string): Promise<Group> {
    const searchedName = await DbGroup.where("groupname", name).first();
    return this.hydrate(searchedName.id?.toString() ?? "");
  }
  async hydrate(searchedId: string): Promise<Group> {
    const groupData = await (DbGroup.where("id", searchedId))
      .first() as DbGroup;
    if (!groupData) throw new NotFoundError(searchedId + " notfound");
    const groupname = groupData.groupname.toString();
    //callbackfunction
    const groupOwnerData = await DbIdDisplayname.where(
      "id",
      groupData.owner?.toString() ?? "",
    ).first();
    const owner = new IdNameMap(
      groupOwnerData.id?.toString() ?? "",
      groupOwnerData.displayname?.toString() ?? "",
    );
    //
    const groupServiceData = await (DbGroup.where("id", searchedId))
      .knownServices();

    const serviceList: AllowedGroupServiceMap[] = await Promise.all(
      groupServiceData.map(
        this.createMapCallbackallowedLists(searchedId, groupname, "service"),
      ),
    ) as AllowedGroupServiceMap[];

    const sentInvitationData = (DbGroup.where("id", searchedId))
      .sentInvitations();

    const sentUserInvites: Invitation[] = await Promise.all(
      (await sentInvitationData).map(async (e) => {
        const senderId = e.senderReference?.toString() ?? "";
        const objId = e.objReference?.toString() ?? "";
        const receiverId = e.receiverReference?.toString() ?? "";
        return new Invitation(
          new IdNameMap(
            senderId,
            await DbIdDisplayname.displayname(senderId),
          ),
          new IdNameMap(
            objId,
            await DbIdDisplayname.displayname(objId),
          ),
          new IdNameMap(
            receiverId,
            await DbIdDisplayname.displayname(receiverId),
          ),
        );
      }),
    );
    const recivedInvitationData = (DbGroup.where("id", searchedId))
      .receivedInvitations();
    //recivedInvitations
    const serviceInvitations: Invitation[] = await Promise.all(
      (await recivedInvitationData).map(async (e) => {
        const senderId = e.senderReference?.toString() ?? "";
        const objId = e.objReference?.toString() ?? "";
        const receiverId = e.receiverReference?.toString() ?? "";
        return new Invitation(
          new IdNameMap(
            senderId,
            await DbIdDisplayname.displayname(senderId),
          ),
          new IdNameMap(
            objId,
            await DbIdDisplayname.displayname(objId),
          ),
          new IdNameMap(
            receiverId,
            await DbIdDisplayname.displayname(receiverId),
          ),
        );
      }),
    );
    //SQL Query
    const userGroupData = await (DbGroup.where("id", searchedId))
      .authorizedUsers();
    const allowedUser: AllowedUserGroupMap[] = await Promise.all(
      userGroupData.map(
        this.createMapCallbackallowedLists(searchedId, groupname, "user"),
      ),
    ) as AllowedUserGroupMap[];

    const _queryData = await DbGroup
      .select(
        DbGroup.field("groupname"),
        DbGroup.field("owner"),
        DbGroup.field("id"),
      )
      .leftJoin(
        DbUserGroup,
        DbUserGroup.field("dbgroup_id"),
        DbGroup.field("id"),
      )
      .leftJoin(
        DbIdDisplaynameUser,
        DbIdDisplaynameUser.field("id"),
        DbUserGroup.field("dbuser_id"),
      )
      .leftJoin(
        DbGroupService,
        DbGroupService.field("dbgroup_id"),
        DbGroup.field("id"),
      )
      .leftJoin(
        DbIdDisplaynameService,
        DbIdDisplaynameService.field("id"),
        DbGroupService.field("dbservice_id"),
      )
      .leftJoin(
        DbInvitationJoinOnObject,
        DbInvitationJoinOnObject.field("objReference"),
        DbGroup.field("id"),
      )
      .leftJoin(
        DbIdDisplaynameInvitationsReceiver,
        DbIdDisplaynameInvitationsReceiver.field("id"),
        DbInvitationJoinOnObject.field("receiverReference"),
      )
      .leftJoin(
        DbIdDisplaynameInvitationsSender,
        DbIdDisplaynameInvitationsSender.field("id"),
        DbInvitationJoinOnObject.field("senderReference"),
      )
      .leftJoin(
        DbInvitationJoinOnReceived,
        DbInvitationJoinOnReceived.field("receiverReference"),
        DbGroup.field("id"),
      )
      .leftJoin(
        DbIdDisplaynameInvitationsObj,
        DbIdDisplaynameInvitationsObj.field("id"),
        DbInvitationJoinOnReceived.field("objReference"),
      )
      .leftJoin(
        DbIdDisplaynameInvitations2Sender,
        DbIdDisplaynameInvitations2Sender.field("id"),
        DbInvitationJoinOnReceived.field("senderReference"),
      )
      .where("Group_id", searchedId)
      .get() as Model[];

    const _tempData: {
      [k in string]: {
        groupname: string;
        //type idnamemap
        owner: string;
        //values of serviceList are objects or concatinated strings
        serviceList: [{ serviceId: string; servicename: string }];
        sentInvitations: {
          [l in string]: {
            receiverRef: { id: string; displayname: string };
            senderRef: { id: string; displayname: string };
          };
        };
        receivedInvitations: {
          [m in string]: {
            objRef: { id: string; displayname: string };
            senderRef: { id: string; displayname: string };
          };
        };
        allowedUser: [{ userRef: ShortEntity; groupRef: ShortEntity }];
      };
    } = {};

    // for (const record of queryData) {
    //   if (!tempData[searchedId]) {
    //     tempData[searchedId] = {
    //       groupname: record.groupname?.toString()!,
    //       owner: record.owner?.valueOf()!,
    //       serviceList: [],
    //       sentInvitations: {},
    //       receivedInvitations: {},
    //       allowedUser: [],
    //     };
    //   }
    // }
    //hydration
    const group: Group = new Group(
      groupname,
      owner,
      searchedId,
      serviceList,
      sentUserInvites,
      serviceInvitations,
      allowedUser,
    );
    return group;
  }

  private createMapCallbackallowedLists(
    searchedId: string,
    groupname: string,
    type: "service" | "user",
  ): (
    value: Model,
    index: number,
    array: Model[],
  ) => Promise<AllowedUserGroupMap | AllowedGroupServiceMap> {
    return async (e) => {
      const id = e["db" + type + "Id"]!.toString();
      const displayname = await DbIdDisplayname.displayname(
        id,
      );
      if (type == "user") {
        return new AllowedUserGroupMap(
          new IdNameMap(id, displayname),
          new IdNameMap(searchedId, groupname),
          e.is_owner?.valueOf() as boolean ?? false,
        );
      }
      if (type == "service") {
        return new AllowedGroupServiceMap(
          new IdNameMap(searchedId, groupname),
          new IdNameMap(id, displayname),
        );
      }
      throw new RuntimeError();
    };
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
    try {
      await this.findById(item.getId());
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.add(item);
        return;
      }
      throw error;
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
    }).then(() =>
      DbUserGroup.create({
        dbuser_id: item.getOwner().id,
        dbgroup_id: item.getId(),
        isOwner: true,
      })
    ).then(() =>
      DbIdDisplayname.create({
        id: item.getId(),
        displayname: item.getDisplayName(),
      })
    ).catch((e) => {
      console.log(e);
      throw e;
    });
  }
}
