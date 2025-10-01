import {
  Database,
  DataTypes,
  Model,
  MySQLConnector,
  Relationships,
} from "@denodb";
//Ausalgern in seperate Datei --> import dieser Datei?
const connector = new MySQLConnector({
  database: Deno.env.get("DB_NAME")!,
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
});
const db = new Database(connector);

class User extends Model {
  static override table = "Users";
  static override timestamps = true;
  static override fields = {
    displayname: DataTypes.string(40),
    id: { type: DataTypes.UUID, primaryKey: true },
  };
}
class UserCredential extends Model {
  static override table = "UserCredentials";
  static override timestamps = true;
  static override fields = {
    _username: DataTypes.string(40),
    _password: DataTypes.string(40),
  };
  static user() {
    return this.hasOne(User);
  }
}

// After both models declarations
//(FK,PK)?
Relationships.belongsTo(UserCredential, User);
db.link([User, UserCredential]);
await db.sync({ drop: true });

const _user = await User.create({
  id: "testID1",
  displayname: "testName1",
});

UserCredential.create({
  userId: "testID1",
  username: "testUsername1",
  password: "testPassword1",
});

export { User, UserCredential };
