import { DataTypes, Model, Relationships } from "@denodb";
import { DbUserCredential } from "./DbUserCredentials.ts";
import { DbIdDisplayname } from "./DbIdDisplayname.ts";
import { DbUserService } from "./DbUserService.ts";
import { DbUserGroup } from "./DbUserGroup.ts";

export class DbUser extends Model {
  static override table = "Users";
  static override timestamps = true;
  static override fields = {
    displayname: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
  };
  static credentials() {
    //hasOne returned a Model...but with
    return this.hasOne(DbUserCredential) as Promise<DbUserCredential>;
  }
  static displayname() {
    return this.hasOne(DbIdDisplayname) as Promise<DbIdDisplayname>;
  }
  static authorizedServices() {
    return this.hasMany(DbUserService) as Promise<Model[]>;
  }
  static authorizedGroups() {
    return this.hasMany(DbUserGroup) as Promise<Model[]>;
  }

  displayname!: string;
  id!: string;
  credentials() {
    return DbUser.where("id", this.id).credentials();
  }
}

//(FK,PK)
Relationships.belongsTo(DbUserCredential, DbUser);
