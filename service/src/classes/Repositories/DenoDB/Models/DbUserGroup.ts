import { Database, DataTypes, Model, MySQLConnector } from "@denodb";
//Ausalgern in seperate Datei --> import dieser Datei?
const connector = new MySQLConnector({
  database: Deno.env.get("DB_NAME")!,
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
});
const db = new Database(connector);

class UserGroup extends Model {
  static override table = "UserGroups";
  static override timestamps = true;
  static override fields = {
    groupId: { type: DataTypes.INTEGER, primaryKey: true },
    serviceId: { type: DataTypes.INTEGER, primaryKey: true },
  };
}
db.link([UserGroup]);

await db.sync({ drop: true });
