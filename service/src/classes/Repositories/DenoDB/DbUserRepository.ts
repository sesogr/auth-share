import { UserRepository } from "../../../interfaceTypes/UserRepository.ts";
import { AllowedUserServiceMap } from "../../AllowedUserServiceMap.ts";
import { User } from "../../User.ts";
import { UserCredential } from "../../UserCredential.ts";
import { DbIdDisplayname } from "./Models/DbIdDisplayname.ts";
import { DbUser } from "./Models/DbUser.ts";
import { DbUserCredential } from "./Models/DbUserCredentials.ts";
import { Database, MySQLConnector } from "@denodb";
import { DbUserService } from "./Models/DbUserService.ts";
import { IdNameMap } from "../../IdNameMap.ts";
import { DbUserGroup } from "./Models/DbUserGroup.ts";
import { AllowedUserGroupMap } from "../../AllowedUserGroupMap.ts";
import { Invitation } from "../../Invitation.ts";

export class DbUserRepository implements UserRepository {
  private readonly connector = new MySQLConnector({
    database: Deno.env.get("DB_NAME")!,
    host: Deno.env.get("DB_HOST")!,
    username: Deno.env.get("DB_USER")!,
    password: Deno.env.get("DB_PASSWORD")!,
  });
  constructor() {
    const db = new Database(this.connector);
    db.link([DbUser, DbUserCredential]);
  }
  findById(_id: string): User {
    throw new Error("Method not implemented.");
  }
  findByName(_name: string): User {
    throw new Error("Method not implemented.");
  }
  findAll(): User[] {
    throw new Error("Method not implemented.");
  }
  add(item: User): void {
    DbUser.create({
      displayname: item.getDisplayName(),
      id: item.getId(),
    });
    DbUserCredential.create({
      dbuser_id: item.getId(),
      username: item.getCredentials().username,
      password: item.getCredentials().password,
    });
    DbIdDisplayname.create({
      id: item.getId(),
      displayname: item.getDisplayName(),
    });
  }
  removeById(_id: string): void {
    throw new Error("Method not implemented.");
  }
  async save(item: User) {
    if (!(await DbUser.find(item.getId()))) {
      this.add(item);
    }
  }
  async hydrate(item: typeof DbUser): Promise<User> {
    let dbItem = await item.get();
    if (!Array.isArray(dbItem)) {
      throw new Error("User not found");
    }
    dbItem = dbItem[0];
    const id = dbItem.id;
    if (!id) {
      throw new Error("User has no id");
    }

    const username = (await item.credentials()).username;
    if (!username) {
      throw new Error("User has no credentials");
    }
    const password = (await item.credentials()).password;
    if (!password) {
      throw new Error("User has no credentials");
    }
    const credentials = new UserCredential(
      username.toString(),
      password.toString(),
    );
    const displayname = dbItem.displayname;
    const userServiceData = DbUserService.where("dbuser_id", id.toString())
      .get();
    if (!Array.isArray(userServiceData)) {
      throw new Error("Expected for typesafety");
    }
    const serviceList: AllowedUserServiceMap[] = await Promise.all(
      userServiceData.map(
        async (e) => {
          let serviceModel = await DbIdDisplayname.where("id", e.service_id)
            .select(
              "displayname",
            ).get();
          if (!Array.isArray(serviceModel)) {
            throw new Error("Expected for typesafety");
          }
          serviceModel = serviceModel[0];
          const serviceName = serviceModel.displayname;
          return new AllowedUserServiceMap(
            new IdNameMap(id.toString(), displayname?.toString() ?? ""),
            new IdNameMap(e.service_id, serviceName?.toString() ?? ""),
            e.is_owner,
          );
        },
      ),
    );
    const userGroupData = DbUserGroup.where("dbuser_id", id.toString())
      .get();
    if (!Array.isArray(userGroupData)) {
      throw new Error("Expected for typesafety");
    }
    const joinedGroups: AllowedUserGroupMap[] = await Promise.all(
      userGroupData.map(
        async (e) => {
          let groupModel = await DbIdDisplayname.where("id", e.group_id)
            .select(
              "displayname",
            ).get();
          if (!Array.isArray(groupModel)) {
            throw new Error("Expected for typesafety");
          }
          groupModel = groupModel[0];
          const groupName = groupModel.displayname;
          return new AllowedUserGroupMap(
            new IdNameMap(id.toString(), displayname?.toString() ?? ""),
            new IdNameMap(e.group_id, groupName?.toString() ?? ""),
            e.is_owner,
          );
        },
      ),
    );
    const invitations: Invitation[] = [];
    const user: User = new User(
      credentials,
      displayname?.toString() ?? "",
      id.toString(),
      serviceList,
      invitations,
      joinedGroups,
    );
    return user;
  }
}
