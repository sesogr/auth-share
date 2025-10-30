import { stub } from "@std/testing/mock";
import { Database, MySQLConnector } from "@denodb";
import { Group } from "../../src/classes/Group.ts";
import { DbGroupRepository } from "../../src/classes/Repositories/DenoDB/DbGroupRepository.ts";
import { DbGroup } from "../../src/classes/Repositories/DenoDB/Models/DbGroup.ts";
import { DbGroupService } from "../../src/classes/Repositories/DenoDB/Models/DbGroupService.ts";
import { DbIdDisplayname } from "../../src/classes/Repositories/DenoDB/Models/DbIdDisplayname.ts";
import { DbInvitation } from "../../src/classes/Repositories/DenoDB/Models/DbInvitation.ts";
import { DbService } from "../../src/classes/Repositories/DenoDB/Models/DbService.ts";
import { DbServiceCredential } from "../../src/classes/Repositories/DenoDB/Models/DbServiceCredentials.ts";
import { DbUser } from "../../src/classes/Repositories/DenoDB/Models/DbUser.ts";
import { DbUserCredential } from "../../src/classes/Repositories/DenoDB/Models/DbUserCredentials.ts";
import { DbUserGroup } from "../../src/classes/Repositories/DenoDB/Models/DbUserGroup.ts";
import { DbUserService } from "../../src/classes/Repositories/DenoDB/Models/DbUserService.ts";
import { setupManyToMany } from "../../src/classes/Repositories/DenoDB/Models/setupManyToMany.ts";
import { IdNameMap } from "../../src/classes/IdNameMap.ts";
import { assertEquals } from "@std/assert";

const connector = new MySQLConnector({
  database: "authshare",
  host: "localhost",
  username: "authshare",
  password: "5ES2#7PhHZplRm",
  port: 13006,
});
const db = new Database(connector);
setupManyToMany();
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

Deno.test("DbGroupRepository - Save()", async (t) => {
  const id = crypto.randomUUID();

  const item = new Group(
    "ReisegruppeAufgehtsAbgehts",
    new IdNameMap(id, "Hans Peter"),
    id,
  );
  await t.step("If Item already exist", async () => {
    const repo = new DbGroupRepository();
    const stubExistId = stub(repo, "existId", async () => {
      return await Promise.resolve(true);
    });
    const stubAdd = stub(repo, "add", async () => await Promise.resolve());
    await repo.save(item);

    console.log(item);
    assertEquals(stubExistId.calls[0].args[0], id);
    console.log(id);
    //watched ()
    assertEquals(stubExistId.calls.length, 1);
    assertEquals(stubAdd.calls.length, 0);

    stubExistId.restore();
    stubAdd.restore();
  });

  await t.step("If Item doesn't exist in Database", async () => {
    const repo = new DbGroupRepository();
    const stubExistId = stub(repo, "existId", async () => {
      return await Promise.resolve(false);
    });
    const stubAdd = stub(repo, "add", async () => await Promise.resolve());
    await repo.save(item);

    assertEquals(stubExistId.calls.length, 1);
    assertEquals(stubAdd.calls.length, 1);

    stubExistId.restore();
    stubAdd.restore();
  });

  await db.close();
});
