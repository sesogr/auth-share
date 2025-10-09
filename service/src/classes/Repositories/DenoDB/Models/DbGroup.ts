import { DataTypes, Model } from "@denodb";
import { DbIdDisplayname } from "./DbIdDisplayname.ts";
import { DbInvitation } from "./DbInvitation.ts";
export class DbGroup extends Model {
  static override table = "Groups";
  static override timestamps = true;
  static override fields = {
    groupname: DataTypes.string(40),
    owner: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
  };
  static displayname() {
    return this.hasOne(DbIdDisplayname) as Promise<DbIdDisplayname>;
  }
  static async receivedInvitations() {
    const id = (await this.first()).id?.toString() ?? "";
    return DbInvitation.where("receiverReference", id).get() as Promise<
      DbInvitation[]
    >;
  }
  static async sentInvitations() {
    const id = (await this.first()).id?.toString() ?? "";
    return DbInvitation.where("objReference", id).get() as Promise<
      DbInvitation[]
    >;
  }
  groupname!: string;
  owner!: string;
  id!: string;
}
