import { DataTypes, Model } from "@denodb";
import { DbUser } from "./DbUser.ts";

export class DbUserCredential extends Model {
  static override table = "UserCredentials";
  static override timestamps = true;
  static override fields = {
    username: DataTypes.string(40),
    hash: DataTypes.string(40),
    salt: DataTypes.string(40),
  };
  static override get(): Promise<DbUserCredential | DbUserCredential[]> {
    return super.get() as Promise<DbUserCredential | DbUserCredential[]>;
  }
  static override first(): Promise<DbUserCredential> {
    return super.first() as Promise<DbUserCredential>;
  }
  static override all(): Promise<DbUserCredential[]> {
    return super.all() as Promise<DbUserCredential[]>;
  }
  dbuserId!: string;
  username!: string;
  hash!: string;
  salt!: string;
  static user() {
    return this.hasOne(DbUser) as Promise<DbUser>;
  }
}
