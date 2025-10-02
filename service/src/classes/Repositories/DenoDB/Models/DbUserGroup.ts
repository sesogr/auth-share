import { DataTypes, Model } from "@denodb";
export class DbUserGroup extends Model {
  static override table = "UserGroups";
  static override timestamps = true;
  static override fields = {
    groupId: { type: DataTypes.INTEGER, foreignKey: true },
    serviceId: { type: DataTypes.INTEGER, foreignKey: true },
  };
}
