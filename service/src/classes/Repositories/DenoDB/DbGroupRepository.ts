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
  DbInvitation,
  DbInvitationJoinOnObject,
  DbInvitationJoinOnReceived,
} from "./Models/DbInvitation.ts";

export class DbGroupRepository implements GroupRepository {
  async findByName(name: string): Promise<Group> {
    const searchedName = await DbGroup.where("groupname", name).first();
    return this.hydrate(searchedName.id?.toString() ?? "");
  }
  async hydrate(searchedId: string): Promise<Group> {
    const queryData = await DbGroup
      .select(
        DbGroup.field("groupname"),
        DbGroup.field("owner"),
        DbGroup.field("id"),
        DbIdDisplaynameService.field("displayname", "allowedServiceName"),
        DbIdDisplaynameService.field("id", "allowedServiceId"),
        DbIdDisplaynameInvitationsReceiver.field(
          "displayname",
          "receiver_name",
        ),
        DbIdDisplaynameInvitationsReceiver.field("id", "receiver_id"),
        DbIdDisplaynameInvitationsSender.field("displayname", "sender_name"),
        DbIdDisplaynameInvitationsSender.field("id", "sender_id"),
        DbIdDisplaynameInvitationsObj.field(
          "displayname",
          "invitedServiceName",
        ),
        DbIdDisplaynameInvitationsObj.field("id", "invitedServiceId"),
        DbIdDisplaynameInvitations2Sender.field(
          "displayname",
          "invitedServiceSenderName",
        ),
        DbIdDisplaynameInvitations2Sender.field("id", "invitedServiceSenderId"),
        DbIdDisplaynameUser.field("id", "allowedUserId"),
        DbIdDisplaynameUser.field("displayname", "allowedUserName"),
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
        throw new RuntimeError();
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
    const owner = allowedUser.find((e) => e.isOwner)!.userRef;
    const group: Group = new Group(
      groupname,
      owner,
      searchedId,
      serviceList,
      sentInvitations,
      receivedInvitations,
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
    //first call of existId --> assertEquals(stubExistId.calls[0].arg[0] in Deno.Test)
    const result = await this.existId(item.getId());
    if (result !== true) {
      this.add(item);
    }
  }
  async existId(id: string): Promise<boolean> {
    if ((await DbGroup.where("id", id).first())) {
      return true;
    } else {
      return false;
    }
  }
  async removeById(id: string): Promise<void> {
    await DbGroup.where("id", id).delete();
  }
  async findById(id: string): Promise<Group> {
    if (!(await this.existId(id))) {
      throw new NotFoundError("Service not found");
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
      await DbIdDisplayname.create({
        id: item.getId(),
        displayname: item.getDisplayName(),
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
          dbuser_id: e.userId,
          dbgroup_id: item.getId(),
          isOwner: e.isOwner,
        };
      }));
    } catch (error) {
      throw error;
    }
  }
}
