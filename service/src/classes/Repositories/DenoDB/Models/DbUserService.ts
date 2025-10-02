import { DataTypes, Model } from "@denodb";
export class DbUserService extends Model {
  static override table = "UserServices";
  static override timestamps = true;
  static override fields = {
    isOwner: DataTypes.BOOLEAN,
  };
}
// const us = Relationships.manyToMany(User, Service);
// us.fields = {
//   ...us.fields,
//   isOwner: DataTypes.BOOLEAN,
