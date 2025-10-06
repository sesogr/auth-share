import { DataTypes, Model } from "@denodb";
import { DbIdDisplayname } from "./DbIdDisplayname.ts";
export class DbGroup extends Model {
  static override table = "Groups";
  static override timestamps = true;
  static override fields = {
    groupname: DataTypes.string(40),
    owner: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
  };
  static displayname() {
    return this.hasOne(DbIdDisplayname);
  }
  groupname!: string;
  owner!: string;
  id!: string;
}
