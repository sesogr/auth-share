import { Model } from "@denodb";
import { FieldAlias } from "@denodb/datatypes";

export class DbAliasableModel extends Model {
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
