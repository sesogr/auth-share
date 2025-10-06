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
  database: Deno.env.get("DB_NAME")!,
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
});
const db = new Database(connector);

await db.sync({ drop: true });

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
await DbUser.create(
  {
    displayname: "Talkmaster Ricky",
    id: "testID5",
  },
);
await DbUserCredential.create({
  dbuser_id: "testID1",
  username: "Hans Meiser",
  password: "1234",
});

await DbUserCredential.create({
  dbuser_id: "testID5",
  username: "Talkmaster Ricky",
  password: "5678",
});

await DbService.create({
  serviceName: "MyService",
  id: "testID2",
});
await DbServiceCredential.create({
  dbservice_id: "testID2",
  username: "ServiceCredentials1",
  password: "4321",
});

await DbUserService.create({
  dbuser_id: "testID1",
  dbservice_id: "testID2",
  isOwner: true,
});

await DbUserService.create({
  dbuser_id: "testID1",
  dbservice_id: "testID2",
  isOwner: true,
});

await DbGroup.create({
  groupname: "TestGroup1",
  owner: "testID1",
  id: "awsedrf",
});

await DbGroup.where("id", "awsedrf").update({ "id": "updatedID" });

console.log(
  await DbGroup.where("id", "updatedID").get(),
  "erste Ausgabe",
);

//const _test = DbUser.where("id", "adskfj").get();
//DbUser.find("adskfj").then((e) => e.credentials());

//.find returns a Promise
console.log(
  DbUser.find("testID1"),
);

//Object of DbUser
console.log(
  await DbUser.find("testID5"),
);

//.get() returns a Promise,
console.log(
  DbUser.where("id", "testID1").get(),
);

//Object of DbUser
console.log(
  await DbUser.where("id", "testID1").get(),
  "hier bin ich",
);

//Object of DbUserCredential with User_id = testID1
console.log(await DbUser.where("id", "testID1").credentials());
//Because of the last ^ where clause this returns "just" the Object of DbUser with User_id = testID1
console.log(
  await DbUser.all(),
  "Grüße",
);
//Array with every
console.log(
  await DbUserCredential.all(),
);
//This returns undefined because there is no ID with "*"
console.log(await DbUser.where("id", "*").credentials());

//Return a empty List/Array
console.log(
  await DbUser.all(),
  "Grüße2",
);
//Object of DbUser
console.log(
  await DbUser.find("testID5"),
);

//Try to change the User_id
console.log(
  await DbUser.where("id", "testID5").get(),
);

//Object of DbUserCredential and .credentials an Objectmethod of DbUser
//deno-ignore
const dbuser: DbUser =
  (await DbUser.where("id", "testID1").get() as DbUser[])[0];
if (dbuser != null) {
  console.log(
    dbuser.credentials(),
  );
}
