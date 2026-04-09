import { UserRepository } from "../../../../interfaceTypes/UserRepository.ts";
import { AllowedUserServiceMap } from "../../Values/AllowedUserServiceMap.ts";
import { User } from "../../Entities/User.ts";

import { DbGroup, DbGroupJoin, DbGroupObjJoin } from "./Models/DbGroup.ts";
import { DbServiceJoin } from "./Models/DbService.ts";
import { DbUser, DbUserSenderJoin } from "./Models/DbUser.ts";
import { DbUserCredential } from "./Models/DbUserCredentials.ts";
import { IdNameMap } from "../../Values/IdNameMap.ts";
import { DbUserGroup } from "./Models/DbUserGroup.ts";
import { AllowedUserGroupMap } from "../../Values/AllowedUserGroupMap.ts";
import { NotFoundError } from "../../errors/NotFoundError.ts";
import { Model } from "@denodb";
import { DbUserService, DbUserServiceTable } from "./Models/DbUserService.ts";
import { DbInvitation } from "./Models/DbInvitation.ts";
import { UserCredential } from "../../Values/UserCredential.ts";
import { Invitation } from "../../Values/Invitation.ts";
import { RuntimeError } from "../../errors/RuntimeError.ts";
import { DbSessions } from "./Models/DbSessions.ts";
import { Session } from "../../Session.ts";
import { DbRepository } from "./DbRepository.ts";
import { Entity } from "../../Entity.ts";
import { ConflictError } from "../../errors/controllerErrors/ConflictError/ConflictError.ts";
import { Logger } from "../../../../interfaceTypes/Logger.ts";

export class DbUserRepository extends DbRepository<User>
  implements UserRepository {
  constructor(logging: Logger) {
    super(
      DbUser,
      "displayname",
      "id",
      logging.withOwnContext("DbUserRepository"),
    );
  }

  override async delete(item: Entity): Promise<void> {
    const groups = await DbGroup.where(DbGroup.field("owner"), item.getId())
      .all();
    if (groups.length > 0) {
      throw new ConflictError(
        `User is owner of the following groups: ${
          groups.map((g) => g.groupname).join(", ")
        }. Please transfer ownership or delete these groups before deleting the user.`,
      );
    }

    const services = (await DbUserService.where({
      [DbUserService.field("dbuser_id")]: item.getId(),
      [DbUserService.field("is_owner")]: true,
    }).all()) as DbUserServiceTable[];
    const _services = await Promise.all(services.map((s) => {
      return DbUserService.where({
        [DbUserService.field("dbservice_id")]: s.dbserviceId,
        [DbUserService.field("is_owner")]: true,
      }).all() as Promise<DbUserServiceTable[]>;
    }));
    _services.forEach((s) => {
      const a = s.find((e) => e.dbuserId !== item.getId());
      if (!a) {
        throw new ConflictError(
          `User is the only owner of Services. Please transfer ownership or delete these services before deleting the user.`,
        );
      }
    });
    await DbUser.where("id", item.getId()).delete();
  }

  async update(item: User): Promise<void> {
    await DbUser.where("id", item.getId()).update({
      displayname: item.getDisplayName(),
    });

    await DbUserCredential.where("dbuser_id", item.getId()).update({
      username: item.getCredentials().username,
      hash: item.getCredentials().hash,
      salt: item.getCredentials().salt,
    });
    const _userSessionModel = await DbSessions.where("dbuser_id", item.getId())
      .all();

    const {
      relationsToDelete: sessionsToDelete,
      relationsToSave: sessionsToSave,
    } = this.nTomFilter(_userSessionModel, item.sessions);
    if (sessionsToDelete.length) {
      await Promise.all(sessionsToDelete.map((e) => e.delete()));
    }
    if (sessionsToSave.length) {
      await DbSessions.create(
        sessionsToSave.map((e) => {
          return {
            id: e.id,
            expiresAt: e.expiresAt,
            dbuserId: e.userId,
          };
        }),
      );
    }
  }

  async findByUserName(name: string): Promise<User> {
    const aUser = await DbUserCredential.where("username", name).first();
    if (!aUser || !aUser.username) {
      throw new NotFoundError("user", "username", name);
    }
    return this.hydrate(aUser.dbuserId);
  }

  async findBySessionToken(token: string): Promise<User> {
    const sessionId = Session.fromSessionTokenToSessionId(token);
    const sessionData = await DbSessions.where("id", sessionId).first();
    return this.hydrate(sessionData.dbuserId);
  }

  async add(item: User): Promise<void> {
    try {
      await DbUser.create({
        displayname: item.getDisplayName(),
        id: item.getId(),
      });
      await DbUserCredential.create({
        dbuser_id: item.getId(),
        username: item.getCredentials().username,
        hash: item.getCredentials().hash,
        salt: item.getCredentials().salt,
      });
    } catch (error) {
      try {
        await DbUser.deleteById(item.getId());
      } catch {
        //try to clean up
      }
      throw error;
    }
  }

  //User_ID=searchedId
  async hydrate(searchedId: string): Promise<User> {
    const queryData = await DbUser
      .select(
        DbUser.field("displayname", "username"),
        DbUserCredential.field("username", "un_cred"),
        DbUserCredential.field("hash", "pw_cred"),
        DbUserCredential.field("salt"),
        DbServiceJoin.field("servicename", "service"),
        DbServiceJoin.field("id", "serviceId"),
        DbUserService.field("is_owner", "serviceOwner"),
        DbGroupJoin.field("groupname", "group"),
        DbGroupJoin.field("id", "groupId"),
        DbUserGroup.field("is_owner", "groupOwner"),
        DbGroupObjJoin.field("groupname", "invObjRefName"),
        DbUserSenderJoin.field("displayname", "invSendRefName"),
        DbInvitation.field("obj_reference", "invObjRef"),
        DbInvitation.field("sender_reference", "invSendRef"),
        DbSessions.field("id", "sessionsId"),
        DbSessions.field("expires_at"),
        DbUser.field("id"),
      )
      .leftJoin(
        DbUserGroup,
        DbUserGroup.field("dbuser_id"),
        DbUser.field("id"),
      )
      .leftJoin(
        DbUserService,
        DbUserService.field("dbuser_id"),
        DbUser.field("id"),
      )
      .leftJoin(
        DbUserCredential,
        DbUserCredential.field("dbuser_id"),
        DbUser.field("id"),
      )
      .leftJoin(
        DbInvitation,
        DbInvitation.field("receiver_reference"),
        DbUser.field("id"),
      )
      .leftJoin(
        DbGroupObjJoin,
        DbGroupObjJoin.field("id"),
        DbInvitation.field("obj_reference"),
      )
      .leftJoin(
        DbUserSenderJoin,
        DbUserSenderJoin.field("id"),
        DbInvitation.field("sender_reference"),
      )
      .leftJoin(
        DbServiceJoin,
        DbServiceJoin.field("id"),
        DbUserService.field("dbservice_id"),
      )
      .leftJoin(
        DbGroupJoin,
        DbGroupJoin.field("id"),
        DbUserGroup.field("dbgroup_id"),
      )
      .leftJoin(
        DbSessions,
        DbSessions.field("dbuser_id"),
        DbUser.field("id"),
      )
      .where(DbUser.field("id"), searchedId)
      .get() as Model[];

    const tempData: {
      [k in string]: {
        credentials: {
          un_cred: string;
          pw_cred: string;
          salt: string;
        };
        displayname: string;
        services: [
          { serviceId: string; servicename: string; is_owner: boolean }?,
        ];
        groups: [{ groupId: string; groupname: string; is_owner: boolean }?];
        invitations: {
          [l in string]: {
            objRef: { id: string; displayname: string };
            senderRef: { id: string; displayname: string };
          };
        };
        sessions: [{ id: string; expiresAt: string }?];
      };
    } = {};

    for (const record of queryData) {
      if (!tempData[searchedId]) {
        tempData[searchedId] = {
          credentials: {
            un_cred: record.unCred?.toString()!,
            pw_cred: record.pwCred?.toString()!,
            salt: record.salt?.toString()!,
          },
          displayname: record.username?.toString()!,
          services: [],
          groups: [],
          invitations: {},
          sessions: [],
        };
      }

      const exists = (type: "service" | "group" | "session"): boolean => {
        if (type == "service") {
          return tempData[searchedId].services.some((
            s,
          ) =>
            s!.serviceId ==
              record.serviceId /* && s.servicename === record.service */
          ) || record.serviceId == undefined;
        } else if (type == "group") {
          return tempData[searchedId].groups.some((g) =>
            g!.groupId === record.groupId
          ) || record.groupId == undefined;
        } else if (type == "session") {
          return tempData[searchedId].sessions.some((s) =>
            s!.id === record.sessionsId
          ) || record.sessionsId == undefined;
        }
        throw new RuntimeError();
      };
      if (!exists("service")) {
        tempData[searchedId].services.push({
          serviceId: record.serviceId?.toString()!,
          servicename: record.service?.toString()!,
          is_owner: record.serviceOwner?.valueOf() as boolean,
        });
      }
      if (!exists("group")) {
        tempData[searchedId].groups.push({
          groupname: record.group?.toString()!,
          groupId: record.groupId?.toString()!,
          is_owner: record.groupOwner?.valueOf() as boolean,
        });
      }
      if (!exists("session")) {
        tempData[searchedId].sessions.push({
          id: record.sessionsId?.toString()!,
          expiresAt: record.expiresAt?.toString()!,
        });
      }
      if (record.invObjRef == undefined) continue;
      const invKey = record.invObjRef?.toString()! +
        record.invSendRef?.toString()!;
      if (!tempData[searchedId].invitations[invKey]) {
        tempData[searchedId].invitations[invKey] = {
          "objRef": {
            "displayname": record.invObjRefName?.toString()!,
            "id": record.invObjRef?.toString()!,
          },
          "senderRef": {
            "displayname": record.invSendRefName?.toString()!,
            "id": record.invSendRef?.toString()!,
          },
        };
      }
    }
    const temp = tempData[searchedId];
    const credentials = new UserCredential(
      temp.credentials.un_cred,
      temp.credentials.pw_cred,
      temp.credentials.salt,
    );
    const displayname = temp.displayname;
    const userRef = new IdNameMap(searchedId, displayname);
    const serviceList: AllowedUserServiceMap[] = temp.services.map((e) =>
      new AllowedUserServiceMap(
        userRef,
        new IdNameMap(e?.serviceId!, e?.servicename!),
        e?.is_owner,
      )
    );
    const invitations: Invitation[] = Object.keys(temp.invitations).map((e) => {
      const currData = temp.invitations[e];
      return new Invitation(
        new IdNameMap(currData.senderRef.id, currData.senderRef.displayname),
        new IdNameMap(currData.objRef.id, currData.objRef.displayname),
        userRef,
        "group",
      );
    });
    const joinedGroups: AllowedUserGroupMap[] = temp.groups.map((e) =>
      new AllowedUserGroupMap(
        userRef,
        new IdNameMap(e?.groupId!, e?.groupname!),
        e?.is_owner,
      )
    );
    let sessions: Session[] = [];
    if (temp.sessions.length > 0) {
      sessions = temp.sessions.map((e) =>
        new Session(e!.id, new Date(e!.expiresAt), searchedId)
      );
    }
    return new User(
      credentials,
      displayname,
      searchedId,
      serviceList,
      invitations,
      joinedGroups,
      sessions,
    );
  }
}
