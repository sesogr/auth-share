import { DataTypes } from "@denodb";
import { DbService } from "./DbService.ts";
import { DbAliasableModel } from "./DbAliasableModel.ts";

export class DbServiceCredential extends DbAliasableModel {
  static override table = "ServiceCredentials";
  static override timestamps = true;
  static override fields = {
    username: DataTypes.string(40),
    password: DataTypes.string(40),
    //TODO add foreign key, primary key etc.
  };
  static service() {
    return this.hasOne(DbService) as Promise<DbService>;
  }

  username!: string;
  password!: string;
  dbserviceId!: string;
}
