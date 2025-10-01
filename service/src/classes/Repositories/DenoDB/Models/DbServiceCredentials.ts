import { Database, DataTypes, Model, MySQLConnector } from "@denodb";
//Ausalgern in seperate Datei --> import dieser Datei?
const connector = new MySQLConnector({
  database: Deno.env.get("DB_NAME")!,
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
});
const db = new Database(connector);

class ServiceCredential extends Model {
  static override table = "ServiceCredentials";
  static override timestamps = true; //needed?
  static override fields = {
    _username: DataTypes.string(40),
    _password: DataTypes.string(40),
    //TODO add foreign key, primary key etc.
  };
}
db.link([ServiceCredential]);

await db.sync({ drop: true });
