import { DataTypes, Model, Relationships } from "@denodb";
import { DbServiceCredential } from "./DbServiceCredentials.ts";
import { DbIdDisplayname } from "./DbIdDisplayname.ts";
import { DbUserService } from "./DbUserService.ts";
import { DbInvitation } from "./DbInvitation.ts";
export class DbService extends Model {
  static override table = "Services";
  static override timestamps = true;
  static override fields = {
    servicename: DataTypes.string(40),
    serviceUrl: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
  };
  static override get(): Promise<DbService | DbService[]> {
    return super.get() as Promise<DbService | DbService[]>;
  }
  static override first(): Promise<DbService> {
    return super.first() as Promise<DbService>;
  }
  static override all(): Promise<DbService[]> {
    return super.all() as Promise<DbService[]>;
  }

  static displayname() {
    return this.hasOne(DbIdDisplayname) as Promise<DbIdDisplayname>;
  }
  static credentials() {
    return this.hasOne(DbServiceCredential) as Promise<DbServiceCredential>;
  }
  static authorizedUsers() {
    return this.hasMany(DbUserService) as Promise<Model[]>;
  }
  static authorizedGroups() {
    return this.hasMany(DbUserService) as Promise<Model[]>;
  }
  static async Invitation() {
    const id = (await this.first()).id?.toString() ?? "";
    return DbInvitation.where("objReference", id).get() as Promise<
      DbInvitation[]
    >;
  }
  servicename!: string;
  id!: string;
}
Relationships.belongsTo(DbServiceCredential, DbService);
