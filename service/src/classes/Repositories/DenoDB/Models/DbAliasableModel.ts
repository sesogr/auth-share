import { Model } from "@denodb";
import { FieldAlias } from "@denodb/datatypes";

export class DbAliasableModel extends Model {
  protected static alias = "";
  static override field(field: string): string;
  static override field(field: string, nameAs: string): FieldAlias;
  static override field(field: string, nameAs?: string): string | FieldAlias {
    const unambiguousColName = `${this.alias || this.table}.${
      field.replace(/[A-Z]/g, (ch) => `_${ch.toLowerCase()}`)
    }`;
    field = field.replace(/_([a-z])/g, (_, ch) => ch.toUpperCase());
    if (!Object.keys(this.fields).includes(field)) {
      throw new Error("Field does not Exist!");
    }

    if (nameAs) {
      return { [nameAs]: unambiguousColName };
    }
    return unambiguousColName;
  }

  static override get<T extends typeof DbAliasableModel>(
    this: T,
  ): Promise<InstanceType<T> | InstanceType<T>[]> {
    return super.get() as Promise<InstanceType<T> | InstanceType<T>[]>;
  }
  static override first<T extends typeof DbAliasableModel>(
    this: T,
  ): Promise<InstanceType<T>> {
    return super.first() as Promise<InstanceType<T>>;
  }
  static override all<T extends typeof DbAliasableModel>(
    this: T,
  ): Promise<InstanceType<T>[]> {
    return super.all() as Promise<InstanceType<T>[]>;
  }
}
