import { ServiceRepository } from "../../../interfaceTypes/ServiceRepository.ts";
import { Service } from "../../Service.ts";
import { DbService } from "./Models/DbService.ts";
import { ServiceCredential } from "../../ServiceCredential.ts";
import { Model } from "@denodb";
import { DbUserService } from "./Models/DbUserService.ts";
import {
  DbIdDisplayname,
  DbIdDisplaynameGroups,
  DbIdDisplaynameInvitationsReceiver,
  DbIdDisplaynameInvitationsSender,
  DbIdDisplaynameUser,
} from "./Models/DbIdDisplayname.ts";
import { AllowedUserServiceMap } from "../../AllowedUserServiceMap.ts";
import { IdNameMap } from "../../IdNameMap.ts";
import { NotFoundError } from "../../../errors/NotFoundError.ts";
import { DbGroupService } from "./Models/DbGroupService.ts";
import { AllowedGroupServiceMap } from "../../AllowedGroupServiceMap.ts";
import { RuntimeError } from "../../../errors/RuntimeError.ts";
import { Invitation } from "../../Invitation.ts";
import { DbServiceCredential } from "./Models/DbServiceCredentials.ts";
import { DbInvitation } from "./Models/DbInvitation.ts";

export class DbServiceRepository implements ServiceRepository {
  constructor() {
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
      throw new NotFoundError("Service not found");
    }
    return this.hydrate(id);
  }
  findByName(_name: string): Promise<Service> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Service[]> {
    throw new Error("Method not implemented.");
  }
  async add(item: Service): Promise<void> {
    await DbService.create({
      id: item.getId(),
      serviceName: item.getDisplayName(),
    }).then(() =>
      DbServiceCredential.create({
        dbservice_id: item.getId(),
        username: item.credentials.split(":")[0],
        password: item.credentials.split(":")[1],
      }).then()
    ).then(() =>
      DbIdDisplayname.create({
        id: item.getId(),
        displayname: item.getDisplayName(),
      })
    ).catch((e) => {
      console.log(e);
      throw e;
    });
    await Promise.all(
      item.authorizedUsers.map((authorizedUsermap) =>
        DbUserService.create({
          dbuser_id: authorizedUsermap.userId,
          dbservice_id: authorizedUsermap.serviceId,
          is_owner: authorizedUsermap.isOwner,
        })
      ),
    ).catch((e) => {
      console.log(e);
      throw e;
    });

    await Promise.all(
      item.authorizedGroups.map((authorizedGroupmap) =>
        DbGroupService.create({
          dbgroup_id: authorizedGroupmap.groupId,
          dbservice_id: authorizedGroupmap.serviceId,
        })
      ),
    ).catch((e) => {
      console.log(e);
      throw e;
    });

    await Promise.all(
      item.sentInvitations.map((invites) =>
        DbInvitation.create({
          senderReference: invites.senderId,
          objReference: invites.objId,
          receiverReference: invites.receiverId,
        })
      ),
    ).catch((e) => {
      console.log(e);
      throw e;
    });
  }
  removeById(_id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async save(item: Service): Promise<void> {
    try {
      await this.findById(item.getId());
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.add(item);
        return;
      }
      throw error;
    }
    throw new Error("UnImplemented");
  }

  async hydrate(searchedId: string): Promise<Service> {
    const queryData = await DbService
      .select(
        DbIdDisplaynameUser.field("displayname", "allowedUserName"),
        DbIdDisplaynameGroups.field("displayname", "allowedGroupName"),
        DbServiceCredential.field("username", "un_cred"),
        DbServiceCredential.field("password", "pw_cred"),
        DbService.field("servicename", "servicename"),
        DbIdDisplaynameInvitationsSender.field("id", "sender_id"),
        DbIdDisplaynameInvitationsSender.field("displayname", "sender_name"),
        DbIdDisplaynameInvitationsReceiver.field("id", "receiver_id"),
        DbIdDisplaynameInvitationsReceiver.field(
          "displayname",
          "receiver_name",
        ),
        DbUserService.field("dbuser_id", "user_id"),
        DbGroupService.field("dbgroup_id", "group_id"),
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
        DbIdDisplaynameInvitationsSender,
        DbIdDisplaynameInvitationsSender.field("id"),
        DbInvitation.field("sender_reference"),
      )
      .leftJoin(
        DbIdDisplaynameInvitationsReceiver,
        DbIdDisplaynameInvitationsReceiver.field("id"),
        DbInvitation.field("receiver_reference"),
      )
      .leftJoin(
        DbIdDisplaynameUser,
        DbIdDisplaynameUser.field("id"),
        DbUserService.field("dbuser_id"),
      )
      .leftJoin(
        DbIdDisplaynameGroups,
        DbIdDisplaynameGroups.field("id"),
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
          sentGroupInvites: {},
          authorizedUsers: [],
          authorizedGroups: [],
        };
      }
      const exists = (type: "authorizedUser" | "authorizedGroup"): boolean => {
        if (type == "authorizedUser") {
          return tempData[searchedId].authorizedUsers.some((u) =>
            u?.userId === record.user_id?.toString()
          ) || record.user_id == undefined;
        } else if (type == "authorizedGroup") {
          return tempData[searchedId].authorizedGroups.some((g) =>
            g?.groupId === record.group_id?.toString()
          ) || record.group_id == undefined;
        }
        throw new RuntimeError();
      };
      if (!exists("authorizedUser")) {
        tempData[searchedId].authorizedUsers.push({
          userId: record.user_id?.toString()!,
          username: record.allowedUserName?.toString()!,
          is_owner: record.is_owner?.valueOf() as boolean,
        });
      }
      if (!exists("authorizedGroup")) {
        tempData[searchedId].authorizedGroups.push({
          groupId: record.group_id?.toString()!,
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
      searchedId,
      sentGroupInvites,
      authorizedUsers,
      authorizedGroups,
    );
  }
}
