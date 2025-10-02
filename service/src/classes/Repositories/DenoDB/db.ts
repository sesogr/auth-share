import { Database, MySQLConnector } from "@denodb";
import { DbGroup } from "./Models/DbGroup.ts";
import { DbUser } from "./Models/DbUser.ts";
import { DbUserGroup } from "./Models/DbUserGroup.ts";
import { DbGroupService } from "./Models/DbGroupService.ts";
import { DbInvitation } from "./Models/DbInvitation.ts";
import { DbService } from "./Models/DbService.ts";
import { DbServiceCredential } from "./Models/DbServiceCredentials.ts";
import { DbUserCredential } from "./Models/DbUserCredentials.ts";
import { DbUserService } from "./Models/DbUserService.ts";

const connector = new MySQLConnector({
  database: Deno.env.get("DB_NAME")!,
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
});
const db = new Database(connector);

db.link([
  DbUser,
  DbUserCredential,
  DbUserService,
  DbService,
  DbServiceCredential,
  DbGroup,
  DbUserGroup,
  DbGroupService,
  DbInvitation,
]);

await db.sync({ drop: true });
