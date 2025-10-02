import { DataTypes, Model, Relationships } from "@denodb";
import { DbUserCredential } from "./DbUserCredentials.ts";

export class DbUser extends Model {
  static override table = "Users";
  static override timestamps = true;
  static override fields = {
    displayname: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
  };
  static credentials() {
    return this.hasOne(DbUserCredential);
  }

  displayname!: string;
  id!: string;
  credentials() {
    return DbUser.where("id", this.id).credentials();
  }
}

//(FK,PK)
Relationships.belongsTo(DbUserCredential, DbUser);
