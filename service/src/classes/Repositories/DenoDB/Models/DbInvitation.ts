import { DataTypes } from "@denodb";
import { UniqueNumber } from "../UniqueNumber.ts";
import { DbAliasableModel } from "./DbAliasableModel.ts";

export class DbInvitation extends DbAliasableModel {
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
  static override get(): Promise<DbInvitation | DbInvitation[]> {
    return super.get() as Promise<DbInvitation | DbInvitation[]>;
  }
  static override first(): Promise<DbInvitation> {
    return super.first() as Promise<DbInvitation>;
  }
  static override all(): Promise<DbInvitation[]> {
    return super.all() as Promise<DbInvitation[]>;
  }
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
