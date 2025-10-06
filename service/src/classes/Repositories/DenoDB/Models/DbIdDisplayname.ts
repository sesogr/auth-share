import { DataTypes, Model, Relationships } from "@denodb";
import { DbUser } from "./DbUser.ts";
import { DbService } from "./DbService.ts";
import { DbGroup } from "./DbGroup.ts";

export class DbIdDisplayname extends Model {
  static override table = "IdDisplayname";
  static override timestamps = true; //needed?
  static override fields = {
    id: DataTypes.STRING,
    displayname: DataTypes.STRING,
  };
}
Relationships.belongsTo(DbIdDisplayname, DbUser, { foreignKey: "id" });
Relationships.belongsTo(DbIdDisplayname, DbService);
Relationships.belongsTo(DbIdDisplayname, DbGroup);
