import { DataTypes, Model, Relationships } from "@denodb";
import { DbServiceCredential } from "./DbServiceCredentials.ts";
export class DbService extends Model {
  static override table = "Services";
  static override timestamps = true;
  static override fields = {
    servicename: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
  };

  servicename!: string;
  id!: string;
}
Relationships.belongsTo(DbServiceCredential, DbService);
