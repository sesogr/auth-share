import { DataTypes, Model } from "@denodb";

export class DbSessions extends Model {
  static override table = "Sessions";
  static override timestamps = true;
  static override fields = {
    id: { type: DataTypes.STRING, primaryKey: true },
    expiresAt: DataTypes.DATE,
  };
  id!: string;
  expiresAt!: string;
  dbUserId!: string;
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
