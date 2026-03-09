import { DataTypes } from "@denodb";
import { DbUser } from "./DbUser.ts";
import { DbAliasableModel } from "./DbAliasableModel.ts";

export class DbUserCredential extends DbAliasableModel {
  static override table = "UserCredentials";
  static override timestamps = true;
  static override fields = {
    username: DataTypes.STRING,
    hash: DataTypes.STRING,
    salt: DataTypes.STRING,
  };

  dbuserId!: string;
  username!: string;
  hash!: string;
  salt!: string;
  static user() {
    return this.hasOne(DbUser) as Promise<DbUser>;
  }
}
