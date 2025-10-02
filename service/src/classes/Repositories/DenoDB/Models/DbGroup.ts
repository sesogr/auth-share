import { DataTypes, Model } from "@denodb";
export class DbGroup extends Model {
  static override table = "Groups";
  static override timestamps = true;
  static override fields = {
    groupname: DataTypes.string(40),
    owner: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
    serviceList: DataTypes.JSON,
    sentInvitations: DataTypes.JSON,
    serviceInvitations: DataTypes.JSON,
    _allowedUser: DataTypes.JSON,
    //TODO add foreign key
    //Datentype.JSON? Reference to each List?
  };
}
