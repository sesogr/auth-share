import { Database, DataTypes, Model, MySQLConnector } from "@denodb";
//Ausalgern in seperate Datei --> import dieser Datei?
const connector = new MySQLConnector({
  database: Deno.env.get("DB_NAME")!,
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
});
const db = new Database(connector);

class GroupService extends Model {
  static override table = "GroupServices";
  static override timestamps = true;
  static override fields = {
    groupRef: { type: DataTypes.INTEGER, primaryKey: true },
    serviceRef: { type: DataTypes.INTEGER, primaryKey: true },
  };
}
db.link([GroupService]);

await db.sync({ drop: true });
