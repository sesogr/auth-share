import { DataTypes, Model } from "@denodb";
import { DbService } from "./DbService.ts";

export class DbServiceCredential extends Model {
  static override table = "ServiceCredentials";
  static override timestamps = true;
  static override fields = {
    username: DataTypes.string(40),
    password: DataTypes.string(40),
    //TODO add foreign key, primary key etc.
  };
  static service() {
    return this.hasOne(DbService);
  }

  username!: string;
  password!: string;
}
