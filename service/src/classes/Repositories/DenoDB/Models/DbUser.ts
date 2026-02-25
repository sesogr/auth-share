import { DataTypes, Model, Relationships } from "@denodb";
import { DbUserCredential } from "./DbUserCredentials.ts";
import { DbUserService } from "./DbUserService.ts";
import { DbUserGroup } from "./DbUserGroup.ts";
import { DbInvitation } from "./DbInvitation.ts";
import { DbSessions } from "./DbSessions.ts";
import { DbAliasableModel } from "./DbAliasableModel.ts";
import { UniqueNumber } from "../UniqueNumber.ts";

export class DbUser extends DbAliasableModel {
  static override table = "Users";
  static override timestamps = true;
  static override fields = {
    displayname: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
  };
  static override get(): Promise<DbUser | DbUser[]> {
    return super.get() as Promise<DbUser | DbUser[]>;
  }
  static override first(): Promise<DbUser> {
    return super.first() as Promise<DbUser>;
  }
  static override all(): Promise<DbUser[]> {
    return super.all() as Promise<DbUser[]>;
  }

  static credentials() {
    //hasOne returned a Model...but with
    return this.hasOne(DbUserCredential) as Promise<DbUserCredential>;
  }
  static authorizedServices() {
    return this.hasMany(DbUserService) as Promise<Model[]>;
  }
  static authorizedGroups() {
    return this.hasMany(DbUserGroup) as Promise<Model[]>;
  }
  static async receivedInvitations() {
    const id = (await this.first()).id?.toString() ?? "";
    return DbInvitation.where("receiverReference", id).get() as Promise<
      DbInvitation[]
    >;
  }
  displayname!: string;
  id!: string;
  credentials() {
    return DbUser.where("id", this.id).credentials();
  }
}

//(FK,PK)
Relationships.belongsTo(DbUserCredential, DbUser);
Relationships.belongsTo(DbSessions, DbUser);

export class DbUserJoin extends DbUser {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}

export class DbUserSenderJoin extends DbUser {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}

export class DbUserReceiverJoin extends DbUser {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
export class DbUserSenderJoin2 extends DbUser {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
