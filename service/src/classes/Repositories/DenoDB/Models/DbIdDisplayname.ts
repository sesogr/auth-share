import { DataTypes } from "@denodb";
import { UniqueNumber } from "../UniqueNumber.ts";
import { DbAliasableModel } from "./DbAliasableModel.ts";

export class DbIdDisplayname extends DbAliasableModel {
  static override table = "IdDisplayname";
  static override timestamps = true;
  static override fields = {
    id: DataTypes.STRING,
    displayname: DataTypes.STRING,
  };
  static async displayname(id: string) {
    const displayname = await this.where("id", id).select("displayname")
      .first();
    return displayname.displayname?.toString() ?? "";
  }
  static override get(): Promise<DbIdDisplayname | DbIdDisplayname[]> {
    return super.get() as Promise<DbIdDisplayname | DbIdDisplayname[]>;
  }
  static override first(): Promise<DbIdDisplayname> {
    return super.first() as Promise<DbIdDisplayname>;
  }
  static override all(): Promise<DbIdDisplayname[]> {
    return super.all() as Promise<DbIdDisplayname[]>;
  }
  id!: string;
  displayname!: string;
}

export class DbIdDisplaynameUser extends DbIdDisplayname {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}

export class DbIdDisplaynameService extends DbIdDisplayname {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}

export class DbIdDisplaynameGroups extends DbIdDisplayname {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}

export class DbIdDisplaynameInvitationsObj extends DbIdDisplayname {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}

export class DbIdDisplaynameInvitationsSender extends DbIdDisplayname {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
export class DbIdDisplaynameInvitationsReceiver extends DbIdDisplayname {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
export class DbIdDisplaynameInvitations2Receiver extends DbIdDisplayname {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
export class DbIdDisplaynameInvitations2Sender extends DbIdDisplayname {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
