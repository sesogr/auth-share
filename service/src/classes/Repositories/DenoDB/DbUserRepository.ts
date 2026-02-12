import { UserRepository } from "../../../interfaceTypes/UserRepository.ts";
import { AllowedUserServiceMap } from "../../AllowedUserServiceMap.ts";
import { User } from "../../User.ts";
import {
  DbIdDisplayname,
  DbIdDisplaynameGroups,
  DbIdDisplaynameInvitationsObj,
  DbIdDisplaynameInvitationsSender,
  DbIdDisplaynameService,
} from "./Models/DbIdDisplayname.ts";
import { DbUser } from "./Models/DbUser.ts";
import { DbUserCredential } from "./Models/DbUserCredentials.ts";
import { IdNameMap } from "../../IdNameMap.ts";
import { DbUserGroup } from "./Models/DbUserGroup.ts";
import { AllowedUserGroupMap } from "../../AllowedUserGroupMap.ts";
import { NotFoundError } from "../../../errors/NotFoundError.ts";
import { Model } from "@denodb";
import { DbUserService } from "./Models/DbUserService.ts";
import { DbInvitation } from "./Models/DbInvitation.ts";
import { UserCredential } from "../../UserCredential.ts";
import { Invitation } from "../../Invitation.ts";
import { RuntimeError } from "../../../errors/RuntimeError.ts";
import { DbSessions } from "./Models/DbSessions.ts";
import { Session } from "../../Session.ts";
import { DbRepository } from "./DbRepository.ts";

export class DbUserRepository extends DbRepository implements UserRepository {
  constructor() {
    super(DbUser, "displayname");
  }
  async update(item: User): Promise<void> {
    await DbUser.where("id", item.getId()).update({
      displayname: item.getDisplayName(),
    });

    await DbIdDisplayname.where("id", item.getId()).update({
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
    if (!aUser.username) {
      throw new Error("User by Username not found!");
    }
    return this.hydrate(aUser.dbuserId);
  }

  async findByDisplayName(name: string): Promise<User> {
    const aUser = await DbUser.where("displayname", name).first();
    if (!aUser.displayname) {
      throw new Error("User by Displayname not found!");
    }
    return this.hydrate(aUser.id);
  }
  async removeById(id: string): Promise<void> {
    await DbUser.where("id", id).delete();
  }
  async findBySessionToken(token: string): Promise<User> {
    const sessionId = Session.fromSessionTokenToSessionId(token);
    const sessionData = await DbSessions.where("id", sessionId).first();
    return this.hydrate(sessionData.dbuserId);
  }
  async findById(id: string): Promise<User> {
    if (!(await this.existId(id))) {
      throw new NotFoundError("");
    }
    return this.hydrate(id);
  }
  override async existId(id: string): Promise<boolean> {
    if ((await DbUser.where("id", id).first())) {
      return true;
    } else {
      return false;
    }
  }

  async findAll() {
    const all = DbUser;
    const allUserIDs = await all.all();
    return Promise.all(allUserIDs.map((user) => {
      return this.hydrate(user.id?.toString() ?? "");
    }));
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
      await DbIdDisplayname.create({
        id: item.getId(),
        displayname: item.getDisplayName(),
      });
    } catch (error) {
      throw error;
    }
  }

  async save(item: User) {
    const result = await this.existId(item.getId());
    if (result !== true) {
      await this.add(item);
    } else {
      this.update(item);
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
        DbIdDisplaynameService.field("displayname", "service"),
        DbIdDisplaynameService.field("id", "serviceId"),
        DbUserService.field("is_owner", "serviceOwner"),
        DbIdDisplaynameGroups.field("displayname", "group"),
        DbIdDisplaynameGroups.field("id", "groupId"),
        DbUserGroup.field("is_owner", "groupOwner"),
        DbIdDisplaynameInvitationsObj.field("displayname", "invObjRefName"),
        DbIdDisplaynameInvitationsSender.field("displayname", "invSendRefName"),
        DbInvitation.field("obj_reference", "invObjRef"),
        DbInvitation.field("sender_reference", "invSendRef"),
        DbSessions.field("id", "sessionsId"),
        DbSessions.field("expires_at"),
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
        DbIdDisplaynameInvitationsObj,
        DbIdDisplaynameInvitationsObj.field("id"),
        DbInvitation.field("obj_reference"),
      )
      .leftJoin(
        DbIdDisplaynameInvitationsSender,
        DbIdDisplaynameInvitationsSender.field("id"),
        DbInvitation.field("sender_reference"),
      )
      .leftJoin(
        DbIdDisplaynameService,
        DbIdDisplaynameService.field("id"),
        DbUserService.field("dbservice_id"),
      )
      .leftJoin(
        DbIdDisplaynameGroups,
        DbIdDisplaynameGroups.field("id"),
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
    const user: User = new User(
      credentials,
      displayname,
      searchedId,
      serviceList,
      invitations,
      joinedGroups,
      sessions,
    );

    return user;
  }
}
