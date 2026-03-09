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
}
