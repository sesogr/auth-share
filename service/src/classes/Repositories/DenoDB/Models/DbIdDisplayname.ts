import { DataTypes, Model } from "@denodb";
import { FieldAlias } from "@denodb/datatypes";
import { UniqueNumber } from "../UniqueNumber.ts";

export class DbIdDisplayname extends Model {
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
class DbAliasHelper extends DbIdDisplayname {
  protected static alias = "";
  static override field(field: string): string;
  static override field(field: string, nameAs: string): FieldAlias;
  static override field(field: string, nameAs?: string): string | FieldAlias {
    const newLocal = `${this.alias}.${
      field.replace(/[A-Z]/g, (ch) => `_${ch.toLowerCase()}`)
    }`;
    field = field.replace(/_([a-z])/g, (_, ch) => ch.toUpperCase());
    if (!Object.keys(this.fields).includes(field)) {
      throw new Error("Field does not Exist!");
    }

    if (nameAs) {
      return { [nameAs]: newLocal };
    }
    return newLocal;
  }
}

export class DbIdDisplaynameUser extends DbAliasHelper {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}

export class DbIdDisplaynameService extends DbAliasHelper {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}

export class DbIdDisplaynameGroups extends DbAliasHelper {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}

export class DbIdDisplaynameInvitationsObj extends DbAliasHelper {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}

export class DbIdDisplaynameInvitationsSender extends DbAliasHelper {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
export class DbIdDisplaynameInvitationsReceiver extends DbAliasHelper {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
export class DbIdDisplaynameInvitations2Receiver extends DbAliasHelper {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
export class DbIdDisplaynameInvitations2Sender extends DbAliasHelper {
  static override alias = UniqueNumber.next() + "";
  static override table = super.table + " AS " + this.alias;
}
