import {
  Database,
  DataTypes,
  Model,
  MySQLConnector,
  Relationships,
} from "@denodb";
import { Service } from "./DbService.ts";
import { User } from "./DbUser.ts";
//Ausalgern in seperate Datei --> import dieser Datei?
const connector = new MySQLConnector({
  database: Deno.env.get("DB_NAME")!,
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
});
const db = new Database(connector);

class UserService extends Model {
  static override table = "UserServices";
  static override timestamps = true;
  static override fields = {
    isOwner: DataTypes.BOOLEAN,
  };
}
const us = Relationships.manyToMany(User, Service);
us.fields = {
  ...us.fields,
  isOwner: DataTypes.BOOLEAN,
};
db.link([UserService, us, User, Service]);
await db.sync({ drop: true });
