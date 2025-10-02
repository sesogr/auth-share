import { DataTypes, Model } from "@denodb";
import { DbUser } from "./DbUser.ts";

export class DbUserCredential extends Model {
  static override table = "UserCredentials";
  static override timestamps = true;
  static override fields = {
    _username: DataTypes.string(40),
    _password: DataTypes.string(40),
  };
  static user() {
    return this.hasOne(DbUser);
  }
}
