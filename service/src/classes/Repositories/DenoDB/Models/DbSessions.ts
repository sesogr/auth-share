import { DataTypes } from "@denodb";
import { DbAliasableModel } from "./DbAliasableModel.ts";

export class DbSessions extends DbAliasableModel {
  static override table = "Sessions";
  static override timestamps = true;
  static override fields = {
    id: { type: DataTypes.STRING, primaryKey: true },
    expiresAt: DataTypes.DATE,
  };
  id!: string;
  expiresAt!: string;
  dbuserId!: string;
  static override get(): Promise<DbSessions | DbSessions[]> {
    return super.get() as Promise<DbSessions | DbSessions[]>;
  }
  static override first(): Promise<DbSessions> {
    return super.first() as Promise<DbSessions>;
  }
  static override all(): Promise<DbSessions[]> {
    return super.all() as Promise<DbSessions[]>;
  }
}
