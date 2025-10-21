import { DataTypes, Model } from "@denodb";
import { FieldAlias } from "@denodb/datatypes";

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
  id!: string;
  displayname!: string;
}
class DbAliasHelper extends DbIdDisplayname {
  protected static alias = "";
  static override field(field: string): string;
  static override field(field: string, nameAs: string): FieldAlias;
  static override field(field: string, nameAs?: string): string | FieldAlias {
    const newLocal = `${this.alias}.${field}`;
    if (!Object.keys(this.fields).includes(field)) {
      throw new Error("Field does not Exist!");
    }

    if (nameAs) {
      return { [nameAs]: newLocal };
    }
    return newLocal;
  }
}

export class DbUserHelper extends DbAliasHelper {
  static override alias = crypto.randomUUID();
  static override table = super.table + " AS " + this.alias;
}

export class DbServiceHelper extends DbAliasHelper {
  static override alias = crypto.randomUUID();
  static override table = super.table + " AS " + this.alias;
}

export class DbGroupHelper extends DbAliasHelper {
  static override alias = crypto.randomUUID();
  static override table = super.table + " AS " + this.alias;
}

export class DbInvitationsObjHelper extends DbAliasHelper {
  static override alias = crypto.randomUUID();
  static override table = super.table + " AS " + this.alias;
}

export class DbInvitationsSenderHelper extends DbAliasHelper {
  static override alias = crypto.randomUUID();
  static override table = super.table + " AS " + this.alias;
}
export class DbInvitationsReceiverHelper extends DbAliasHelper {
  static override alias = crypto.randomUUID();
  static override table = super.table + " AS " + this.alias;
}
export class DbIdDisplaynameReceiver extends DbAliasHelper {
  static override alias = crypto.randomUUID();
  static override table = super.table + " AS " + this.alias;
}
export class DbInvitationsSenderHelper2 extends DbAliasHelper {
  static override alias = crypto.randomUUID();
  static override table = super.table + " AS " + this.alias;
}
