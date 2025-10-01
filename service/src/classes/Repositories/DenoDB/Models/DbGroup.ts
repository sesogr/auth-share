import { Database, DataTypes, Model, MySQLConnector } from "@denodb";
//Ausalgern in seperate Datei --> import dieser Datei?
const connector = new MySQLConnector({
  database: Deno.env.get("DB_NAME")!,
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
});
const db = new Database(connector);

class Group extends Model {
  static override table = "Groups";
  static override timestamps = true;
  static override fields = {
    groupname: DataTypes.string(40),
    owner: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
    serviceList: DataTypes.JSON,
    sentInvitations: DataTypes.JSON,
    serviceInvitations: DataTypes.JSON,
    _allowedUser: DataTypes.JSON,
    //TODO add foreign key
    //Datentype.JSON? Reference to each List?
  };
}
db.link([Group]);

await db.sync({ drop: true });
