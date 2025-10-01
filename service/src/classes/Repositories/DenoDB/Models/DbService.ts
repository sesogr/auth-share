import { Database, DataTypes, Model, MySQLConnector } from "@denodb";
//Ausalgern in seperate Datei --> import dieser Datei?
const connector = new MySQLConnector({
  database: Deno.env.get("DB_NAME")!,
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
});
const db = new Database(connector);

class Service extends Model {
  static override table = "Services";
  static override timestamps = true;
  static override fields = {
    serviceName: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
    _authorizedUsers: DataTypes.JSON,
    _authorizedGroups: DataTypes.JSON,
    _sentInvitations: DataTypes.JSON,
    //TODO add foreign key
    //Datentype.JSON? Reference to each List?
  };
}
db.link([Service]);

await db.sync({ drop: true });

export { Service };
