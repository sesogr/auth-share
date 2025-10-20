import { UserRepository } from "../../../interfaceTypes/UserRepository.ts";
import { AllowedUserServiceMap } from "../../AllowedUserServiceMap.ts";
import { User } from "../../User.ts";
import {
  DbGroupHelper,
  DbIdDisplayname,
  DbInvitationsObjHelper,
  DbInvitationsSenderHelper,
  DbServiceHelper,
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

export class DbUserRepository implements UserRepository {
  async findByName(name: string): Promise<User> {
    const aUser = await DbUser.where("displayname", name).first();
    if (!aUser.id) {
      throw new Error("User not found");
    }
    return this.hydrate(aUser.id.toString());
  }
  async removeById(id: string): Promise<void> {
    await DbUser.where("id", id).delete();
  }
  findById(id: string): Promise<User> {
    return this.hydrate(id);
  }

  async findAll() {
    const all = DbUser;
    const allUserIDs = await all.all();
    return Promise.all(allUserIDs.map((user) => {
      return this.hydrate(user.id?.toString() ?? "");
    }));
  }
  async add(item: User): Promise<void> {
    await DbUser.create({
      displayname: item.getDisplayName(),
      id: item.getId(),
    }).then(() =>
      DbUserCredential.create({
        dbuser_id: item.getId(),
        username: item.getCredentials().username,
        password: item.getCredentials().password,
      }).then(() =>
        DbIdDisplayname.create({
          id: item.getId(),
          displayname: item.getDisplayName(),
        })
      ).catch((e) => {
        console.log(e);
        throw e;
      })
    );
  }

  async save(item: User) {
    try {
      await this.findById(item.getId());
    } catch (error) {
      if (error instanceof NotFoundError) {
        return await this.add(item);
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
        DbUserCredential.field("password", "pw_cred"),
        DbServiceHelper.field("displayname", "service"),
        DbServiceHelper.field("id", "serviceID"),
        DbUserService.field("is_owner", "serviceOwner"),
        DbGroupHelper.field("displayname", "group"),
        DbGroupHelper.field("id", "groupID"),
        DbUserGroup.field("is_owner", "groupOwner"),
        DbInvitationsObjHelper.field("displayname", "invObjRefName"),
        DbInvitationsSenderHelper.field("displayname", "invSendRefName"),
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
        DbInvitationsObjHelper,
        DbInvitationsObjHelper.field("id"),
        DbInvitation.field("obj_reference"),
      )
      .leftJoin(
        DbInvitationsSenderHelper,
        DbInvitationsSenderHelper.field("id"),
        DbInvitation.field("sender_reference"),
      )
      .leftJoin(
        DbServiceHelper,
        DbServiceHelper.field("id"),
        DbUserService.field("dbservice_id"),
      )
      .leftJoin(
        DbGroupHelper,
        DbGroupHelper.field("id"),
        DbUserGroup.field("dbgroup_id"),
      )
      .where("Users_id", searchedId)
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
      if (!tempData[searchedId]) {
        tempData[searchedId] = {
          credentials: {
            un_cred: record.un_cred?.toString()!,
            pw_cred: record.pw_cred?.toString()!,
          },
          displayname: record.username?.toString()!,
          services: [],
          groups: [],
          invitations: {},
        };
      }

      const exists = () =>
        tempData[searchedId].services.some((
          s,
        ) =>
          s?.serviceId ===
            record.serviceId /* && s.servicename === record.service */
        );
      if (!exists) {
        tempData[searchedId].services.push({
          serviceId: record.serviceId?.toString()!,
          servicename: record.service?.toString()!,
          is_owner: record.serviceOwner?.valueOf() as boolean,
        });
      }
      const existingGoups = () =>
        tempData[searchedId].groups.some((
          s,
        ) => s?.groupId === record.groupId);
      if (!existingGoups) {
        tempData[searchedId].groups.push({
          groupname: record.group?.toString()!,
          groupId: record.groupId?.toString()!,
          is_owner: record.groupOwner?.valueOf() as boolean,
        });
      }
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
    //Map
    const temp = tempData[searchedId];
    const credentials = new UserCredential(
      temp.credentials.un_cred,
      temp.credentials.pw_cred,
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
    const user: User = new User(
      credentials,
      displayname,
      searchedId,
      serviceList,
      invitations,
      joinedGroups,
    );
    return user;
  }
}
