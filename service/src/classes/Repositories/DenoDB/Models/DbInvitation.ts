import { DataTypes } from "@denodb";
import { UniqueNumber } from "../UniqueNumber.ts";
import { DbAliasableModel } from "./DbAliasableModel.ts";

export class DbInvitation extends DbAliasableModel {
  static override table = "Invitations";
  static override timestamps = true; //needed?
  static override fields = {
    senderReference: DataTypes.STRING,
    objReference: DataTypes.STRING,
    receiverReference: DataTypes.STRING,
  };
}

export class DbInvitationJoinOnSender extends DbInvitation {
  protected static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}

export class DbInvitationJoinOnReceived extends DbInvitation {
  protected static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}

export class DbInvitationJoinOnObject extends DbInvitation {
  protected static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
// Relationships.hasMany(DbInvitation, DbUser);
// Relationships.hasMany(DbInvitation, DbGroup);
// Relationships.hasMany(DbInvitation, DbService);
