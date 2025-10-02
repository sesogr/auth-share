import { DataTypes, Model } from "@denodb";
import { DbUser } from "./DbUser.ts";

export class DbUserCredential extends Model {
  static override table = "UserCredentials";
  static override timestamps = true;
  static override fields = {
    username: DataTypes.string(40),
    password: DataTypes.string(40),
  };

  username!: string;
  password!: string;
  static user() {
    return this.hasOne(DbUser);
  }
}
