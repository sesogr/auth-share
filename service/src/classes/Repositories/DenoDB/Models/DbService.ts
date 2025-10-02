import { DataTypes, Model, Relationships } from "@denodb";
import { DbServiceCredential } from "./DbServiceCredentials.ts";
export class DbService extends Model {
  static override table = "Services";
  static override timestamps = true;
  static override fields = {
    serviceName: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
    _authorizedUsers: DataTypes.JSON,
    _authorizedGroups: DataTypes.JSON,
    _sentInvitations: DataTypes.JSON,
    //TODO add foreign key
    //Datentype.JSON? Reference to each List?
  };
}
Relationships.belongsTo(DbServiceCredential, DbService);
