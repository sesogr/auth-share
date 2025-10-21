import { DbUserRepository } from "../../src/classes/Repositories/DenoDB/DbUserRepository.ts";
import { assertEquals, assertInstanceOf } from "@std/assert";
import { User } from "../../src/classes/User.ts";
import { UserRepository } from "../../src/interfaceTypes/UserRepository.ts";
import { Database, Model, MySQLConnector } from "@denodb";
import { DbGroup } from "../../src/classes/Repositories/DenoDB/Models/DbGroup.ts";
import {
  DbGroupService,
} from "../../src/classes/Repositories/DenoDB/Models/DbGroupService.ts";
import {
  DbIdDisplayname,
  DbIdDisplaynameGroups,
  DbIdDisplaynameInvitationsObj,
  DbIdDisplaynameInvitationsSender,
  DbIdDisplaynameService,
} from "../../src/classes/Repositories/DenoDB/Models/DbIdDisplayname.ts";
import { DbInvitation } from "../../src/classes/Repositories/DenoDB/Models/DbInvitation.ts";
import { DbService } from "../../src/classes/Repositories/DenoDB/Models/DbService.ts";
import { DbServiceCredential } from "../../src/classes/Repositories/DenoDB/Models/DbServiceCredentials.ts";
import { DbUser } from "../../src/classes/Repositories/DenoDB/Models/DbUser.ts";
import { DbUserCredential } from "../../src/classes/Repositories/DenoDB/Models/DbUserCredentials.ts";
import {
  DbUserGroup,
} from "../../src/classes/Repositories/DenoDB/Models/DbUserGroup.ts";
import {
  DbUserService,
} from "../../src/classes/Repositories/DenoDB/Models/DbUserService.ts";
import { setupManyToMany } from "../../src/classes/Repositories/DenoDB/Models/setupManyToMany.ts";
//import fakeUser from "../testuser.json" with { type: "json" };
import { RuntimeError } from "../../src/errors/RuntimeError.ts";
const connector = new MySQLConnector({
  database: "authshare",
  host: "localhost",
  username: "authshare",
  password: "5ES2#7PhHZplRm",
  port: 13006,
});
const db = new Database(connector);
setupManyToMany();
db.link([
  DbUser,
  DbService,
  DbGroup,
  DbUserService,
  DbUserCredential,
  DbServiceCredential,
  DbUserGroup,
  DbGroupService,
  DbInvitation,
  DbIdDisplayname,
]);

Deno.test("DbUserRepository: hydrate", async () => {
  // Methode aufrufen und erwartetes Ergebnis überprüfen
  const userRepository: UserRepository & {
    hydrate: (id: string) => Promise<User>;
  } = new DbUserRepository();

  const fakeuser: User = new User(
    new UserCredential(
      fakeUser[0].credentials._username,
      fakeUser[0].credentials._password,
    ),
    fakeUser[0].displayname,
    fakeUser[0].id,
    fakeUser[0].callableService,
    fakeUser[0].userGroupInvitations,
    fakeUser[0].joinedGroups,
  );
  const user = await userRepository.hydrate(fakeuser.getId());
  assertInstanceOf(user, User);
  assertEquals(user.getId(), fakeuser.getId());
  assertEquals(user.getDisplayName(), fakeuser.getDisplayName());
  assertEquals(user.listServices().length, fakeuser.listServices().length);
  assertEquals(user.listServices()[0], fakeuser.listServices()[0]);
  assertEquals(
    user.listJoinedGroups().length,
    fakeuser.listJoinedGroups().length,
  );
  assertEquals(user.listJoinedGroups()[0], fakeuser.listJoinedGroups()[0]);
});

Deno.test("HYdrate with DenoDB", async () => {
  const queryData = await DbUser
    .select(
      DbUser.field("displayname", "Username"),
      DbUserCredential.field("username", "uncred"),
      DbUserCredential.field("password", "pwcred"),
      DbIdDisplaynameService.field("displayname", "Service"),
      DbIdDisplaynameService.field("id", "ServiceID"),
      DbIdDisplaynameGroups.field("displayname", "Group"),
      DbIdDisplaynameGroups.field("id", "GroupID"),
      DbInvitation.field("obj_reference", "InvObjRef"),
      DbInvitation.field("sender_reference", "InvSendRef"),
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
      DbIdDisplaynameService,
      DbIdDisplaynameService.field("id"),
      DbUserService.field("dbservice_id"),
    )
    .leftJoin(
      DbIdDisplaynameGroups,
      DbIdDisplaynameGroups.field("id"),
      DbUserGroup.field("dbgroup_id"),
    ).get();

  console.log(queryData);
  //.where("Users_id", searchedId);
});

Deno.test("Hydrate with GroupChange", async () => {
  const queryData = await DbUser
    .select(
      DbUser.field("id", "userID"),
      DbUser.field("displayname", "username"),
      DbUserCredential.field("username", "un_cred"),
      DbUserCredential.field("password", "pw_cred"),
      DbIdDisplaynameService.field("displayname", "service"),
      DbIdDisplaynameService.field("id", "serviceID"),
      DbUserService.field("is_owner", "serviceOwner"),
      DbIdDisplaynameGroups.field("displayname", "group"),
      DbIdDisplaynameGroups.field("id", "groupID"),
      DbUserGroup.field("is_owner", "groupOwner"),
      DbIdDisplaynameInvitationsObj.field("displayname", "invObjRefName"),
      DbIdDisplaynameInvitationsSender.field("displayname", "invSendRefName"),
      DbInvitation.field("obj_reference", "invObjRef"),
      DbInvitation.field("sender_reference", "invSendRef"),
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
    .get() as Model[];

  const tempData: {
    [k in string]: {
      credentials: {
        un_cred: string;
        pw_cred: string;
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
    };
  } = {};

  for (const record of queryData) {
    const userId = record.userId?.toString() ?? "";
    if (!tempData[userId]) {
      tempData[userId] = {
        credentials: {
          un_cred: record.unCred?.toString()!,
          pw_cred: record.pwCred?.toString()!,
        },
        displayname: record.username?.toString()!,
        services: [],
        groups: [],
        invitations: {},
      };
    }
    const exists = (type: "service" | "group"): boolean => {
      if (type == "service") {
        return tempData[userId].services.some((
          s,
        ) =>
          s!.serviceId ==
            record.serviceId /* && s.servicename === record.service */
        ) || record.serviceId == undefined;
      } else if (type == "group") {
        return tempData[userId].groups.some((g) =>
          g!.groupId === record.groupId
        ) || record.groupId == undefined;
      }
      throw new RuntimeError();
    };
    if (!exists("service")) {
      tempData[userId].services.push({
        serviceId: record.serviceId?.toString()!,
        servicename: record.service?.toString()!,
        is_owner: record.serviceOwner?.valueOf() as boolean,
      });
    }

    if (!exists("group")) {
      tempData[userId].groups.push({
        groupname: record.group?.toString()!,
        groupId: record.groupId?.toString()!,
        is_owner: record.groupOwner?.valueOf() as boolean,
      });
    }
    if (record.invObjRef == undefined) continue;
    const invKey = record.invObjRef?.toString()! +
      record.invSendRef?.toString()!;
    if (!tempData[userId].invitations[invKey]) {
      tempData[userId].invitations[invKey] = {
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
  console.log(tempData);
  console.log(Object.keys(tempData[Object.keys(tempData)[0]].invitations));
});
