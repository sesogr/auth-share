import { DataTypes, Model } from "@denodb";

export class DbIdDisplayname extends Model {
  static override table = "IdDisplayname";
  static override timestamps = true; //needed?
  static override fields = {
    id: DataTypes.STRING,
    displayname: DataTypes.STRING,
  };
  id!: string;
  displayname!: string;
}
// Relationships.belongsTo(DbIdDisplayname, DbUser, { foreignKey: "id" });
// Relationships.belongsTo(DbIdDisplayname, DbService);
// Relationships.belongsTo(DbIdDisplayname, DbGroup);
