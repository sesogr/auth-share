import { DataTypes, Model } from "@denodb";
import { FieldAlias } from "@denodb/datatypes";

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

class DbJoinHelper extends DbInvitation {
  protected static alias = "";
  static override field(field: string): string;
  static override field(field: string, nameAs: string): FieldAlias;
  static override field(field: string, nameAs?: string): string | FieldAlias {
    const newLocal = `${this.alias}.${field}`;
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

export class DbInvitationJoinOnSender extends DbJoinHelper {
  protected static override alias = crypto.randomUUID();
  static override table = super.table + " AS " + this.alias;
}

export class DbInvitationJoinOnReceived extends DbJoinHelper {
  protected static override alias = crypto.randomUUID();
  static override table = super.table + " AS " + this.alias;
}

export class DbInvitationJoinOnObject extends DbJoinHelper {
  protected static override alias = crypto.randomUUID();
  static override table = super.table + " AS " + this.alias;
}
// Relationships.hasMany(DbInvitation, DbUser);
// Relationships.hasMany(DbInvitation, DbGroup);
// Relationships.hasMany(DbInvitation, DbService);
