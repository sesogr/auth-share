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
import { DbIdDisplayname } from "./Models/DbIdDisplayname.ts";

const connector = new MySQLConnector({
  database: Deno.env.get("DB_NAME")!,
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
});
const db = new Database(connector);

db.link([
  DbUser,
  DbService,
  DbGroup,
  DbUserService,
  DbUserCredential,
  DbServiceCredential,
  DbUserGroup,
  DbGroupService,
  DbInvitation,
  DbIdDisplayname,
]);

await db.sync({ drop: true });

await DbUser.create(
  {
    displayname: "Hans Meiser",
    id: "testID1",
  },
);
DbUserCredential.create({
  dbuser_id: "testID1",
  _username: "Hans Meiser",
  _password: "1234",
});

await DbService.create({
  serviceName: "MyService",
  id: "testID2",
});
DbServiceCredential.create({
  dbservice_id: "testID2",
  _username: "ServiceCredentials1",
  _password: "4321",
});

DbUserService.create({
  dbuser_id: "testID1",
  dbservice_id: "testID2",
  isOwner: true,
});

DbUserService.create({
  dbuser_id: "testID1",
  dbservice_id: "testID2",
  isOwner: true,
});

DbGroup.create({
  groupname: "TestGroup1",
  owner: "testID1",
  id: "awsedrf",
  serviceList: JSON.stringify([]),
  sentInvitations: JSON.stringify([]),
  serviceInvitations: JSON.stringify([]),
  _allowedUser: JSON.stringify([]),
});
