import { ServiceRepository } from "../../../interfaceTypes/ServiceRepository.ts";
import { Service } from "../../Service.ts";
import { DbService } from "./Models/DbService.ts";
import { ServiceCredential } from "../../ServiceCredential.ts";
import { Model } from "@denodb";
import { DbUserService } from "./Models/DbUserService.ts";

import { DbGroupJoin } from "./Models/DbGroup.ts";
import {
  DbUserJoin,
  DbUserReceiverJoin,
  DbUserSenderJoin,
} from "./Models/DbUser.ts";

import { AllowedUserServiceMap } from "../../AllowedUserServiceMap.ts";
import { IdNameMap } from "../../IdNameMap.ts";
import { NotFoundError } from "../../../errors/NotFoundError.ts";
import { DbGroupService } from "./Models/DbGroupService.ts";
import { AllowedGroupServiceMap } from "../../AllowedGroupServiceMap.ts";
import { RuntimeError } from "../../../errors/RuntimeError.ts";
import { Invitation } from "../../Invitation.ts";
import { DbServiceCredential } from "./Models/DbServiceCredentials.ts";
import { DbInvitation } from "./Models/DbInvitation.ts";
import { DbRepository } from "./DbRepository.ts";

export class DbServiceRepository extends DbRepository
  implements ServiceRepository {
  constructor() {
    super(DbService, "servicename");
  }
  async findOwnedByUserId(userId: string): Promise<Service[]> {
    const userServiceData: Model[] = await DbUserService.where(
      "dbuser_id",
      userId,
    )
      .get() as Model[];

    return Promise.all(
      userServiceData.map((e: Model) => {
        if (!e.dbserviceId) {
          throw new RuntimeError("No dbserviceId");
        }
        return this.hydrate(e.dbserviceId.toString());
      }),
    );
  }
  findAuthorizedForId(_Id: string): Promise<Service[]> {
    throw new Error("Method not implemented.");
  }
  async findById(id: string): Promise<Service> {
    if ((await DbService.where("id", id).first()) === undefined) {
      throw new NotFoundError("service", "id", id);
    }
    return this.hydrate(id);
  }
  findByDisplayName(_name: string): Promise<Service> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Service[]> {
    throw new Error("Method not implemented.");
  }
  async update(item: Service): Promise<void> {
    await DbService.where("id", item.getId()).update({
      servicename: item.getDisplayName(),
      serviceUrl: item.serviceUrl,
    });
    await DbServiceCredential.where("dbservice_id", item.getId()).update({
      username: item.credentials.username!,
      password: item.credentials.password!,
    });
    //GroupService --> allowedGroups[]
    //.all gives all rows out
    const _groupServiceModel = await DbGroupService.where(
      "dbservice_id",
      item.getId(),
    ).all();

    const {
      relationsToDelete: groupRelationsToDelete,
      relationsToSave: groupRelationsToSave,
    } = this.nTomFilter(_groupServiceModel, item.allowedGroups);
    await Promise.all(groupRelationsToDelete.map((e) => e.delete()));
    await DbGroupService.create(
      groupRelationsToSave.map((e) => {
        return {
          id: e.toString(),
          dbserviceId: e.getServiceId,
          dbgroupId: e.getGroupId,
        };
      }),
    );
    //UserService
    const _userServiceModel = await DbUserService.where(
      "dbservice_id",
      item.getId(),
    ).all();

    const {
      relationsToDelete: userRelationToDelete,
      relationsToSave: userRelationsToSave,
    } = this.nTomFilter(
      _userServiceModel,
      item.allowedUsers,
    );
    await Promise.all(userRelationToDelete.map((e) => e.delete()));
    await DbUserService.create(userRelationsToSave.map((e) => {
      return {
        id: e.toString(),
        dbuserId: e.getUserId,
        dbserviceId: e.getServiceId,
        is_owner: e.isOwner,
      };
    }));
    //Invitations //N:M
    //sender_reference=user, reciever_reference=group, obj_reference=whole invitation ->
    await this.updateInvitation(item);
    //end of update!!
  }

  async add(item: Service): Promise<void> {
    try {
      await DbService.create({
        id: item.getId(),
        serviceName: item.getDisplayName(),
        serviceUrl: item.serviceUrl,
      });
      await DbServiceCredential.create({
        //@ts-ignore dbservice_id doesnt get typed, but dbuser_id does get typed, so i am not sure where the issue is yet.
        dbservice_id: item.getId(),
        username: item.credentials.username,
        password: item.credentials.password,
      });

      await DbUserService.create(
        item.allowedUsers.map((allowedUsermap) => {
          return {
            id: allowedUsermap.toString(),
            dbuser_id: allowedUsermap.getUserId,
            dbservice_id: allowedUsermap.getServiceId,
            is_owner: allowedUsermap.isOwner,
          };
        }),
      );
      if (item.allowedGroups.length != 0) {
        await DbGroupService.create(
          item.allowedGroups.map((allowedGroupmap) => {
            return {
              id: allowedGroupmap.toString(),
              dbgroup_id: allowedGroupmap.getGroupId,
              dbservice_id: allowedGroupmap.getServiceId,
            };
          }),
        );
      }
      if (item.sentInvitations.length != 0) {
        await DbInvitation.create(
          item.sentInvitations.map((invites) => {
            return {
              senderReference: invites.senderId,
              objReference: invites.objId,
              receiverReference: invites.receiverId,
            };
          }),
        );
      }
    } catch (error) {
      throw error;
    }
  }
  removeById(_id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async hydrate(searchedId: string): Promise<Service> {
    const queryData = await DbService
      .select(
        DbUserJoin.field("displayname", "allowedUserName"),
        DbGroupJoin.field("groupname", "allowedGroupName"),
        DbServiceCredential.field("username", "un_cred"),
        DbServiceCredential.field("password", "pw_cred"),
        DbService.field("servicename", "servicename"),
        DbService.field("service_url"),
        DbUserSenderJoin.field("id", "sender_id"),
        DbUserSenderJoin.field("displayname", "sender_name"),
        DbUserReceiverJoin.field("id", "receiver_id"),
        DbUserReceiverJoin.field(
          "displayname",
          "receiver_name",
        ),
        DbUserService.field("dbuser_id", "userId"),
        DbUserService.field("is_owner", "isOwner"),
        DbGroupService.field("dbgroup_id", "groupId"),
      )
      .leftJoin(
        DbUserService,
        DbUserService.field("dbservice_id"),
        DbService.field("id"),
      )
      .leftJoin(
        DbGroupService,
        DbGroupService.field("dbservice_id"),
        DbService.field("id"),
      )
      .leftJoin(
        DbServiceCredential,
        DbServiceCredential.field("dbservice_id"),
        DbService.field("id"),
      )
      .leftJoin(
        DbInvitation,
        DbInvitation.field("obj_reference"),
        DbService.field("id"),
      )
      .leftJoin(
        DbUserSenderJoin,
        DbUserSenderJoin.field("id"),
        DbInvitation.field("sender_reference"),
      )
      .leftJoin(
        DbUserReceiverJoin,
        DbUserReceiverJoin.field("id"),
        DbInvitation.field("receiver_reference"),
      )
      .leftJoin(
        DbUserJoin,
        DbUserJoin.field("id"),
        DbUserService.field("dbuser_id"),
      )
      .leftJoin(
        DbGroupJoin,
        DbGroupJoin.field("id"),
        DbGroupService.field("dbgroup_id"),
      )
      .where(DbService.field("id"), searchedId)
      .get() as Model[];
    const tempData: {
      [k in string]: {
        credentials: {
          un_cred: string;
          pw_cred: string;
        };
        displayname: string;
        serviceUrl: string;
        sentGroupInvites: {
          [l in string]: {
            senderRef: { id: string; displayname: string };
            receiverRef: { id: string; displayname: string };
          };
        };
        authorizedUsers: [
          { userId: string; username: string; is_owner: boolean }?,
        ];
        authorizedGroups: [
          { groupId: string; groupname: string }?,
        ];
      };
    } = {};

    for (const record of queryData) {
      if (!tempData[searchedId]) {
        tempData[searchedId] = {
          credentials: {
            un_cred: record.unCred?.toString()!,
            pw_cred: record.pwCred?.toString()!,
          },
          displayname: record.servicename?.toString()!,
          serviceUrl: record.serviceUrl?.toString()!,
          sentGroupInvites: {},
          authorizedUsers: [],
          authorizedGroups: [],
        };
      }
      const exists = (type: "authorizedUser" | "authorizedGroup"): boolean => {
        if (type == "authorizedUser") {
          return tempData[searchedId].authorizedUsers.some((u) =>
            u?.userId === record.userId?.toString()
          ) || record.userId == undefined;
        } else if (type == "authorizedGroup") {
          return tempData[searchedId].authorizedGroups.some((g) =>
            g?.groupId === record.groupId?.toString()
          ) || record.groupId == undefined;
        }
        throw new RuntimeError("DbServiceRepository exists");
      };
      if (!exists("authorizedUser")) {
        tempData[searchedId].authorizedUsers.push({
          userId: record.userId?.toString()!,
          username: record.allowedUserName?.toString()!,
          is_owner: record.isOwner?.valueOf() as boolean,
        });
      }
      if (!exists("authorizedGroup")) {
        tempData[searchedId].authorizedGroups.push({
          groupId: record.groupId?.toString()!,
          groupname: record.allowedGroupName?.toString()!,
        });
      }
      if (record.obj_reference == undefined) continue;
      //unique Key
      const invKey = record.sender_id?.toString()! + //556656 5576878
        record.receiver_id?.toString()!;
      if (!tempData[searchedId].sentGroupInvites[invKey]) {
        tempData[searchedId].sentGroupInvites[invKey] = {
          "senderRef": {
            "displayname": record.sender_name?.toString()!,
            "id": record.sender_id?.toString()!,
          },
          "receiverRef": {
            "displayname": record.receiver_name?.toString()!,
            "id": record.receiver_id?.toString()!,
          },
        };
      }
    }
    const temp = tempData[searchedId];
    const credentials = new ServiceCredential(
      temp.credentials.un_cred,
      temp.credentials.pw_cred,
    );
    const servicename = temp.displayname;
    const serviceUrl = temp.serviceUrl;
    const serviceRef = new IdNameMap(
      searchedId,
      servicename,
    );
    const sentGroupInvites = Object.values(temp.sentGroupInvites).map((e) =>
      new Invitation(
        new IdNameMap(
          e.senderRef.id,
          e.senderRef.displayname,
        ),
        serviceRef,
        new IdNameMap(
          e.receiverRef.id,
          e.receiverRef.displayname,
        ),
      )
    );
    const authorizedUsers = temp.authorizedUsers.map((e) =>
      new AllowedUserServiceMap(
        new IdNameMap(
          e?.userId!,
          e?.username!,
        ),
        serviceRef,
        e?.is_owner,
      )
    );
    const authorizedGroups = temp.authorizedGroups.map((e) =>
      new AllowedGroupServiceMap(
        new IdNameMap(
          e?.groupId!,
          e?.groupname!,
        ),
        serviceRef,
      )
    );

    return new Service(
      credentials,
      servicename,
      serviceUrl,
      searchedId,
      sentGroupInvites,
      authorizedUsers,
      authorizedGroups,
    );
  }
}
