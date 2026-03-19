import { GroupRepository } from "../../../interfaceTypes/GroupRepository.ts";
import { Group } from "../../Group.ts";
import { DbGroup, DbGroupReceiverJoin } from "./Models/DbGroup.ts";
import { DbUserGroup } from "./Models/DbUserGroup.ts";

import {
  DbUserJoin,
  DbUserSenderJoin,
  DbUserSenderJoin2,
} from "./Models/DbUser.ts";
import { DbServiceJoin, DbServiceObjJoin } from "./Models/DbService.ts";
import { RuntimeError } from "../../../errors/RuntimeError.ts";
import { IdNameMap } from "../../IdNameMap.ts";
import { AllowedGroupServiceMap } from "../../AllowedGroupServiceMap.ts";
import { Invitation } from "../../Invitation.ts";
import { AllowedUserGroupMap } from "../../AllowedUserGroupMap.ts";
import { Model } from "@denodb";
import { NotFoundError } from "../../../errors/NotFoundError.ts";
import { DbGroupService } from "./Models/DbGroupService.ts";
import {
  DbInvitation,
  DbInvitationJoinOnObject,
  DbInvitationJoinOnReceived,
} from "./Models/DbInvitation.ts";
import { DbRepository } from "./DbRepository.ts";

export class DbGroupRepository extends DbRepository implements GroupRepository {
  constructor() {
    super(DbGroup, "groupname");
  }

  async update(item: Group): Promise<void> {
    await DbGroup.where("id", item.getId()).update({
      groupname: item.getDisplayName(),
      owner: item.getOwner().id,
    });

    const _userGroupModel = await DbUserGroup.where(
      "dbgroup_id",
      item.getId(),
    ).all();

    const {
      relationsToDelete: groupRelationsToDelete,
      relationsToSave: groupRelationsToSave,
    } = this.nTomFilter(_userGroupModel, item.allowedUser);

    await Promise.all(groupRelationsToDelete.map((e) => e.delete()));
    await DbUserGroup.create(
      groupRelationsToSave.map((e) => {
        return {
          id: e.toString(),
          dbuserId: e.getUserId,
          dbgroupId: e.getGroupId,
        };
      }),
    );
    //Invitations
    //sender_reference=user, receiver_reference=group, obj_reference=whole invitation ->
    await this.updateInvitation(item);
  }

  async findByDisplayName(name: string): Promise<Group> {
    const searchedName = await DbGroup.where("groupname", name).first();
    return this.hydrate(searchedName.id?.toString() ?? "");
  }

  async hydrate(searchedId: string): Promise<Group> {
    const queryData = await DbGroup
      .select(
        DbGroup.field("groupname"),
        DbGroup.field("owner"),
        DbGroup.field("id"),
        DbServiceJoin.field("servicename", "allowedServiceName"),
        DbServiceJoin.field("id", "allowedServiceId"),
        DbGroupReceiverJoin.field(
          "groupname",
          "receiver_name",
        ),
        DbGroupReceiverJoin.field("id", "receiver_id"),
        DbUserSenderJoin.field("displayname", "sender_name"),
        DbUserSenderJoin.field("id", "sender_id"),
        DbServiceObjJoin.field(
          "servicename",
          "invitedServiceName",
        ),
        DbServiceObjJoin.field("id", "invitedServiceId"),
        DbUserSenderJoin2.field(
          "displayname",
          "invitedServiceSenderName",
        ),
        DbUserSenderJoin2.field("id", "invitedServiceSenderId"),
        DbUserJoin.field("id", "allowedUserId"),
        DbUserJoin.field("displayname", "allowedUserName"),
        DbUserGroup.field("is_owner"),
      )
      .leftJoin(
        DbUserGroup,
        DbUserGroup.field("dbgroup_id"),
        DbGroup.field("id"),
      )
      .leftJoin(
        DbUserJoin,
        DbUserJoin.field("id"),
        DbUserGroup.field("dbuser_id"),
      )
      .leftJoin(
        DbGroupService,
        DbGroupService.field("dbgroup_id"),
        DbGroup.field("id"),
      )
      .leftJoin(
        DbServiceJoin,
        DbServiceJoin.field("id"),
        DbGroupService.field("dbservice_id"),
      )
      .leftJoin(
        DbInvitationJoinOnObject,
        DbInvitationJoinOnObject.field("obj_reference"),
        DbGroup.field("id"),
      )
      .leftJoin(
        DbGroupReceiverJoin,
        DbGroupReceiverJoin.field("id"),
        DbInvitationJoinOnObject.field("receiver_reference"),
      )
      .leftJoin(
        DbUserSenderJoin,
        DbUserSenderJoin.field("id"),
        DbInvitationJoinOnObject.field("sender_reference"),
      )
      .leftJoin(
        DbInvitationJoinOnReceived,
        DbInvitationJoinOnReceived.field("receiver_reference"),
        DbGroup.field("id"),
      )
      .leftJoin(
        DbServiceObjJoin,
        DbServiceObjJoin.field("id"),
        DbInvitationJoinOnReceived.field("obj_reference"),
      )
      .leftJoin(
        DbUserSenderJoin2,
        DbUserSenderJoin2.field("id"),
        DbInvitationJoinOnReceived.field("sender_reference"),
      )
      .where(DbGroup.field("id"), searchedId)
      .get() as Model[];

    const tempData: {
      [k in string]: {
        groupname: string;
        serviceList: [
          { serviceId: string; servicename: string }?,
        ];
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
        allowedUser: [
          { userId: string; username: string; isOwner: boolean }?,
        ];
      };
    } = {};

    for (const record of queryData) {
      if (!tempData[searchedId]) {
        tempData[searchedId] = {
          groupname: record.groupname?.toString()!,
          serviceList: [],
          sentInvitations: {},
          receivedInvitations: {},
          allowedUser: [],
        };
      }
      const exists = (type: "serviceList" | "allowedUser"): boolean => {
        if (type == "serviceList") {
          return tempData[searchedId].serviceList.some((
            s,
          ) =>
            s!.serviceId ==
              record.serviceId /* && s.servicename === record.service */
          ) || record.serviceId == undefined;
        } else if (type == "allowedUser") {
          return tempData[searchedId].allowedUser.some((g) =>
            g?.userId === record.allowedUserId?.toString()
          ) || record.allowedUserId == undefined;
        }
        throw new RuntimeError("DbGroupRepository.exists");
      };
      if (!exists("serviceList")) {
        tempData[searchedId].serviceList.push({
          serviceId: record.allowedServiceId?.toString()!,
          servicename: record.allowedServiceName?.toString()!,
        });
      }
      if (!exists("allowedUser")) {
        tempData[searchedId].allowedUser.push({
          userId: record.allowedUserId?.toString()!,
          username: record.allowedUserName?.toString()!,

          isOwner: record.isOwner?.valueOf() as boolean,
        });
      }
      if (
        record.receiver_id && record.sender_id && record.sender_name &&
        record.receiver_name
      ) {
        const invSenderKey = record.receiver_id.toString() +
          record.sender_id.toString();
        if (!tempData[searchedId].sentInvitations[invSenderKey]) {
          tempData[searchedId].sentInvitations[invSenderKey] = {
            "receiverRef": {
              "id": record.receiver_id.toString(),
              "displayname": record.receiver_name.toString(),
            },
            "senderRef": {
              "id": record.sender_id.toString(),
              "displayname": record.sender_name.toString(),
            },
          };
        }
      }
      if (record.invitedServiceId) {
        const invReceiverKey = record.invitedServiceId?.toString()! +
          record.invitedServiceSenderId?.toString()!;
        if (!tempData[searchedId].receivedInvitations[invReceiverKey]) {
          tempData[searchedId].receivedInvitations[invReceiverKey] = {
            "objRef": {
              "id": record.invitedServiceId?.toString()!,
              "displayname": record.invitedServiceName?.toString()!,
            },
            "senderRef": {
              "id": record.invitedServiceSenderId?.toString()!,
              "displayname": record.invitedServiceSenderName?.toString()!,
            },
          };
        }
      }
    }
    //hydration
    const temp = tempData[searchedId];
    const groupname: string = temp.groupname;
    const groupRef = new IdNameMap(searchedId, groupname);
    const serviceList: AllowedGroupServiceMap[] = temp.serviceList.map((e) =>
      new AllowedGroupServiceMap(
        groupRef,
        new IdNameMap(e?.serviceId!, e?.servicename!),
      )
    );
    const sentInvitations: Invitation[] = Object.keys(
      temp.sentInvitations,
    ).map((e) => {
      const currData = temp.sentInvitations[e];
      //is the sequence important? new Invitation(sender, obj, receiver) --> below we have receiver, sender, obj
      return new Invitation(
        new IdNameMap(currData.senderRef.id, currData.senderRef.displayname),
        groupRef,
        new IdNameMap(
          currData.receiverRef.id,
          currData.receiverRef.displayname,
        ),
      );
    });

    const receivedInvitations: Invitation[] = Object.keys(
      temp.receivedInvitations,
    ).map((e) => {
      const currData = temp.receivedInvitations[e];
      return new Invitation(
        new IdNameMap(currData.senderRef.id, currData.senderRef.displayname),
        new IdNameMap(currData.objRef.id, currData.objRef.displayname),
        groupRef,
      );
    });

    const allowedUser: AllowedUserGroupMap[] = temp.allowedUser.map((e) =>
      new AllowedUserGroupMap(
        new IdNameMap(e?.userId!, e?.username!),
        new IdNameMap(searchedId, groupname),
        e?.isOwner!,
      )
    );
    return new Group(
      groupname,
      allowedUser.find((e) => e.isOwner)!.userRef,
      searchedId,
      serviceList,
      sentInvitations,
      receivedInvitations,
      allowedUser,
    );
  }

  async findOwnedByUserId(userId: string): Promise<Group[]> {
    const searchedList = await DbUserGroup.where({
      dbuser_id: userId,
      is_owner: true,
    }).get() as unknown as { dbgroupId: string }[];
    if (Array.isArray(searchedList)) {
      return await Promise.all(searchedList.map((group) => {
        return this.hydrate(group.dbgroupId);
      }));
    }
    throw new RuntimeError("DbGroupRepository.findOwnedByUserId");
  }

  async saveAll(item: Group[]) {
    await Promise.all(item.map(async (e) => await this.save(e)));
  }

  async removeById(id: string): Promise<void> {
    await DbGroup.where("id", id).delete();
  }

  async findById(id: string): Promise<Group> {
    if (!(await this.existId(id))) {
      throw new NotFoundError("group", "id", id);
    }
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
    try {
      await DbGroup.create({
        groupname: item.getDisplayName(),
        owner: item.getOwner().id,
        id: item.getId(),
      });

      if (item.listSentInvitation().length) {
        await DbInvitation.create(
          item.listSentInvitation().map((e) => {
            return {
              "obj_reference": e.objId,
              "receiver_reference": e.receiverId,
              "sender_reference": e.senderId,
            };
          }),
        );
      }
      await DbUserGroup.create(item.allowedUser.map((e) => {
        return {
          id: e.toString(),
          dbuser_id: e.getUserId,
          dbgroup_id: item.getId(),
          isOwner: e.isOwner,
        };
      }));
    } catch (error) {
      throw error;
    }
  }
}
