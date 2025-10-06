import { DataTypes, Model, Relationships } from "@denodb";
import { DbServiceCredential } from "./DbServiceCredentials.ts";
import { DbIdDisplayname } from "./DbIdDisplayname.ts";
export class DbService extends Model {
  static override table = "Services";
  static override timestamps = true;
  static override fields = {
    servicename: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
  };
  static displayname() {
    return this.hasOne(DbIdDisplayname);
  }
  static credentials() {
    return this.hasOne(DbServiceCredential);
  }
  servicename!: string;
  id!: string;
}
Relationships.belongsTo(DbServiceCredential, DbService);
