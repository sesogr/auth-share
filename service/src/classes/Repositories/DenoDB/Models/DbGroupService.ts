import { DataTypes, Model } from "@denodb";
export class DbGroupService extends Model {
  static override table = "GroupServices";
  static override timestamps = true;
  static override fields = {
    groupRef: { type: DataTypes.INTEGER, foreignKey: true },
    serviceRef: { type: DataTypes.INTEGER, foreignKey: true },
  };
}
