import { DataTypes, Model } from "@denodb";

export class DbInvitation extends Model {
  static override table = "Invitations";
  static override timestamps = true; //needed?
  static override fields = {
    //id: { type: DataTypes.UUID, primaryKey: true }, could be make sense?
    senderReference: DataTypes.STRING,
    objReference: DataTypes.STRING,
    receiverReference: DataTypes.STRING,
    //TODO add foreign key and primary key
    //Datentype.JSON? Reference to each List?
  };
}
// Relationships.hasMany(DbInvitation, DbUser);
// Relationships.hasMany(DbInvitation, DbGroup);
// Relationships.hasMany(DbInvitation, DbService);
