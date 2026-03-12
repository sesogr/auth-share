import { DataTypes, Model } from "@denodb";
import { DbGroupService } from "./DbGroupService.ts";
import { DbUserGroup } from "./DbUserGroup.ts";
import { DbInvitation } from "./DbInvitation.ts";
import { DbAliasableModel } from "./DbAliasableModel.ts";
import { UniqueNumber } from "../UniqueNumber.ts";
export class DbGroup extends DbAliasableModel {
  static override table = "Groups";
  static override timestamps = true;
  static override fields = {
    groupname: DataTypes.string(40),
    owner: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
  };

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
export class DbGroupJoin extends DbGroup {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
export class DbGroupReceiverJoin extends DbGroup {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
export class DbGroupObjJoin extends DbGroup {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
