import { Database, DataTypes, Model, MySQLConnector } from "@denodb";
//Ausalgern in seperate Datei --> import dieser Datei?
const connector = new MySQLConnector({
  database: Deno.env.get("DB_NAME")!,
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
});
const db = new Database(connector);

class Invitation extends Model {
  static override table = "Invitations";
  static override timestamps = true; //needed?
  static override fields = {
    //id: { type: DataTypes.UUID, primaryKey: true }, could be make sense?
    senderReference: DataTypes.JSON,
    objReference: DataTypes.JSON,
    receiverReference: DataTypes.JSON,
    //TODO add foreign key and primary key
    //Datentype.JSON? Reference to each List?
  };
}
db.link([Invitation]);

await db.sync({ drop: true });
