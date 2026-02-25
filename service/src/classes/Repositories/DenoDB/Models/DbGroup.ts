import { DataTypes, Model } from "@denodb";
import { DbIdDisplayname } from "./DbIdDisplayname.ts";
import { DbGroupService } from "./DbGroupService.ts";
import { DbUserGroup } from "./DbUserGroup.ts";
import { DbInvitation } from "./DbInvitation.ts";
import { DbAliasableModel } from "./DbAliasableModel.ts";
export class DbGroup extends DbAliasableModel {
  static override table = "Groups";
  static override timestamps = true;
  static override fields = {
    groupname: DataTypes.string(40),
    owner: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
  };
  static override get(): Promise<DbGroup | DbGroup[]> {
    return super.get() as Promise<DbGroup | DbGroup[]>;
  }
  static override first(): Promise<DbGroup> {
    return super.first() as Promise<DbGroup>;
  }
  static override all(): Promise<DbGroup[]> {
    return super.all() as Promise<DbGroup[]>;
  }
  static displayname() {
    return this.hasOne(DbIdDisplayname) as Promise<DbIdDisplayname>;
  }
  static knownServices() {
    return this.hasMany(DbGroupService) as Promise<Model[]>;
  }
  static authorizedUsers() {
    return this.hasMany(DbUserGroup) as Promise<Model[]>;
  }
  static async receivedInvitations() {
    const id = (await this.first()).id?.toString() ?? "";
    return DbInvitation.where("receiverReference", id).get() as Promise<
      DbInvitation[]
    >;
  }
  static async sentInvitations() {
    const id = (await this.first()).id?.toString() ?? "";
    return DbInvitation.where("objReference", id).get() as Promise<
      DbInvitation[]
    >;
  }
  groupname!: string;
  owner!: string;
  id!: string;
}
