import { UserRepository } from "../../../interfaceTypes/UserRepository.ts";
import { AllowedUserServiceMap } from "../../AllowedUserServiceMap.ts";
import { User } from "../../User.ts";
import { UserCredential } from "../../UserCredential.ts";
import { DbIdDisplayname } from "./Models/DbIdDisplayname.ts";
import { DbUser } from "./Models/DbUser.ts";
import { DbUserCredential } from "./Models/DbUserCredentials.ts";
import { IdNameMap } from "../../IdNameMap.ts";
import { DbUserGroup } from "./Models/DbUserGroup.ts";
import { AllowedUserGroupMap } from "../../AllowedUserGroupMap.ts";
import { Invitation } from "../../Invitation.ts";
import { NotFoundError } from "../../../errors/NotFoundError.ts";

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
      ).catch(() => {
        throw new Error();
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
  async hydrate(searchedId: string): Promise<User> {
    //For now the only thing i saw to make the code thinner

    const dbItem = await (DbUser.where("id", searchedId)).first();
    if (!dbItem) {
      throw new NotFoundError("User not found");
    }
    const username =
      (await (DbUser.where("id", searchedId)).credentials()).username;
    if (!username) {
      throw new Error("User has no credentials");
    }
    const password =
      (await (DbUser.where("id", searchedId)).credentials()).password;
    if (!password) {
      throw new Error("User has no credentials");
    }
    const credentials = new UserCredential(
      username.toString(),
      password.toString(),
    );
    const displayname = dbItem.displayname;
    const userServiceData = await DbUser.where("id", searchedId)
      .authorizedServices();
    //am i get this right?
    //const userServiceData = await DbUser.where("id", searchedId).hasMany(DbUserService) as Promise<Model[]>;

    // if (!Array.isArray(userServiceData)) {
    //   console.log(userServiceData);
    //   throw new Error("Expected for typesafety");
    // }
    const serviceList: AllowedUserServiceMap[] = await Promise.all(
      userServiceData.map(
        async (e) => {
          if (!e.dbservice_id) {
            throw new Error("Expected for typesafety");
          }
          let serviceModel = await DbIdDisplayname.where(
            "id",
            e.dbservice_id.toString(),
          )
            .select(
              "displayname",
            ).get();
          if (!Array.isArray(serviceModel)) {
            throw new Error("Expected for typesafety");
          }
          serviceModel = serviceModel[0];
          const serviceName = serviceModel.displayname;
          return new AllowedUserServiceMap(
            new IdNameMap(searchedId, displayname?.toString() ?? ""),
            new IdNameMap(
              e.dbservice_id.toString(),
              serviceName?.toString() ?? "",
            ),
            e.is_owner?.valueOf() as boolean ?? false,
          );
        },
      ),
    );
    const userGroupData = await DbUserGroup.where("dbuser_id", searchedId)
      .get();
    if (!Array.isArray(userGroupData)) {
      throw new Error("Expected for typesafety");
    }
    const joinedGroups: AllowedUserGroupMap[] = await Promise.all(
      userGroupData.map(
        async (e) => {
          let groupModel = await DbIdDisplayname.where(
            "id",
            e.dbgroup_id?.toString() ?? "",
          )
            .select(
              "displayname",
            ).get();
          if (!Array.isArray(groupModel)) {
            throw new Error("Expected for typesafety");
          }
          groupModel = groupModel[0];
          const groupName = groupModel.displayname;
          return new AllowedUserGroupMap(
            new IdNameMap(searchedId, displayname?.toString() ?? ""),
            new IdNameMap(
              e.dbgroup_id?.toString() ?? "",
              groupName?.toString() ?? "",
            ),
            e.is_owner?.valueOf() as boolean ?? false,
          );
        },
      ),
    );
    const invitationData = await (DbUser.where("id", searchedId))
      .receivedInvitations();

    //is there a difference between sentInvites and this invitations?
    const invitations: Invitation[] = await Promise.all(
      invitationData.map(async (e) => {
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
    const user: User = new User(
      credentials,
      displayname?.toString() ?? "",
      searchedId,
      serviceList,
      invitations,
      joinedGroups,
    );
    return user;
  }
}
