import { DataTypes, Model, Relationships } from "@denodb";
import { DbServiceCredential } from "./DbServiceCredentials.ts";
import { DbUserService } from "./DbUserService.ts";
import { DbInvitation } from "./DbInvitation.ts";
import { DbAliasableModel } from "./DbAliasableModel.ts";
import { UniqueNumber } from "../UniqueNumber.ts";
export class DbService extends DbAliasableModel {
  static override table = "Services";
  static override timestamps = true;
  static override fields = {
    servicename: DataTypes.string(40),
    serviceUrl: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
  };

  static credentials() {
    return this.hasOne(DbServiceCredential) as Promise<DbServiceCredential>;
  }
  static authorizedUsers() {
    return this.hasMany(DbUserService) as Promise<Model[]>;
  }
  static authorizedGroups() {
    return this.hasMany(DbUserService) as Promise<Model[]>;
  }
  static async Invitation() {
    const id = (await this.first()).id?.toString() ?? "";
    return DbInvitation.where("objReference", id).get() as Promise<
      DbInvitation[]
    >;
  }
  servicename!: string;
  id!: string;
}
Relationships.belongsTo(DbServiceCredential, DbService);

export class DbServiceJoin extends DbService {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
export class DbServiceObjJoin extends DbService {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
