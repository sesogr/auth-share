import { DataTypes, Model } from "@denodb";
import { FieldAlias } from "https://deno.land/x/denodb@v1.4.0/lib/data-types.ts";

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
// Relationships.belongsTo(DbIdDisplayname, DbUser, { foreignKey: "id" });
// Relationships.belongsTo(DbIdDisplayname, DbService);
// Relationships.belongsTo(DbIdDisplayname, DbGroup);

export class DbUserHelper extends Model {
  static override table = "IdDisplayname AS UserMap";
  static override timestamps = true;
  static override fields = {
    id: DataTypes.STRING,
    displayname: DataTypes.STRING,
  };
}

export class DbServiceHelper extends Model {
  static override table = "IdDisplayname AS ServiceMap";
  static override timestamps = true;
  static override fields = {
    id: DataTypes.STRING,
    displayname: DataTypes.STRING,
  };
  static override field(field: string): string;
  static override field(field: string, nameAs: string): FieldAlias;
  static override field(field: string, nameAs?: string): string | FieldAlias {
    const newLocal = `ServiceMap.${field}`;
    if (!Object.keys(this.fields).includes(field)) {
      throw new Error("Field does not Exist!");
    }

    if (nameAs) {
      return { [nameAs]: newLocal };
    }
    return newLocal;
  }
}

export class DbGroupHelper extends Model {
  static override table = "IdDisplayname AS GroupMap";
  static override timestamps = true;
  static override fields = {
    id: DataTypes.STRING,
    displayname: DataTypes.STRING,
  };
  static override field(field: string): string;
  static override field(field: string, nameAs: string): FieldAlias;
  static override field(field: string, nameAs?: string): string | FieldAlias {
    const newLocal = `GroupMap.${field}`;
    if (!Object.keys(this.fields).includes(field)) {
      throw new Error("Field does not Exist!");
    }

    if (nameAs) {
      return { [nameAs]: newLocal };
    }
    return newLocal;
  }
}
