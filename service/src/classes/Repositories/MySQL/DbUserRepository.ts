import { Database, DataTypes, Model, MySQLConnector } from "@denodb";
const connector = new MySQLConnector({
  database: Deno.env.get("DB_NAME")!,
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
});
const db = new Database(connector);

class User extends Model {
  static override table = "Users";
  static override timestamps = true; //needed?
  static override fields = {
    credentials: DataTypes.STRING,
    displayname: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
  };
}
db.link([User]);

await db.sync({ drop: true });
