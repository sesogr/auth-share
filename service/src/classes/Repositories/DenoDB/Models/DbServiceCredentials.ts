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
    return this.hasOne(DbService) as Promise<DbService>;
  }
  static override get(): Promise<DbServiceCredential | DbServiceCredential[]> {
    return super.get() as Promise<DbServiceCredential | DbServiceCredential[]>;
  }
  static override first(): Promise<DbServiceCredential> {
    return super.first() as Promise<DbServiceCredential>;
  }
  static override all(): Promise<DbServiceCredential[]> {
    return super.all() as Promise<DbServiceCredential[]>;
  }
  username!: string;
  password!: string;
  dbServiceId!: string;
}
