import { Database, MySQLConnector } from "@denodb";
import { DbGroup } from "../../src/classes/Repositories/DenoDB/Models/DbGroup.ts";
import { DbGroupService } from "../../src/classes/Repositories/DenoDB/Models/DbGroupService.ts";
import { DbInvitation } from "../../src/classes/Repositories/DenoDB/Models/DbInvitation.ts";
import { DbService } from "../../src/classes/Repositories/DenoDB/Models/DbService.ts";
import { DbServiceCredential } from "../../src/classes/Repositories/DenoDB/Models/DbServiceCredentials.ts";
import { DbUser } from "../../src/classes/Repositories/DenoDB/Models/DbUser.ts";
import { DbUserCredential } from "../../src/classes/Repositories/DenoDB/Models/DbUserCredentials.ts";
import { DbUserGroup } from "../../src/classes/Repositories/DenoDB/Models/DbUserGroup.ts";
import { DbUserService } from "../../src/classes/Repositories/DenoDB/Models/DbUserService.ts";

const connector = new MySQLConnector({
  database: "mariadb",
  host: "localhost:13006",
  username: "authshare",
  password: "5ES2#7PhHZplRm",
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

const _test = DbUser.where("id", "adskfj").get();
//DbUser.find("adskfj").then((e) => e.credentials());
