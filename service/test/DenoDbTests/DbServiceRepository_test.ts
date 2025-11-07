import { Database, MySQLConnector } from "@denodb";
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
import { DbServiceRepository } from "../../src/classes/Repositories/DenoDB/DbServiceRepository.ts";
import { FakeObjectGen } from "../../src/FakeObjectGen.ts";
import { stub } from "@std/testing/mock";
import { assert, assertEquals } from "@std/assert";

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
Deno.test("ABC", async (_t) => {
  const repo = new DbServiceRepository();
  const ownedList = await repo.findOwnedByUserId(
    "15ed8f0d-f3c3-4e6c-84dc-c2c0824741be",
  );
  console.log(ownedList);
});

Deno.test("DbServiceRepository - Save()", async (t) => {
  const testService = FakeObjectGen.createFakeService();
  const id = testService.getId();
  let idReturn: boolean;
  let displaynameReturn: boolean;

  const repo = new DbServiceRepository();
  const stubExistId = stub(repo, "existId", () => {
    return Promise.resolve(idReturn);
  });
  const stubExistDisplayname = stub(repo, "existDisplayname", () => {
    return Promise.resolve(displaynameReturn);
  });
  const stubAdd = stub(repo, "add", () => {
    return Promise.resolve();
  });
  const restoreStubs = () => {
    while (
      stubExistId.calls.length || stubExistDisplayname.calls.length ||
      stubAdd.calls.length
    ) {
      stubExistId.calls.pop();
      stubExistDisplayname.calls.pop();
      stubAdd.calls.pop();
    }
  };
  await t.step("If Service already exist", async () => {
    idReturn = true;
    displaynameReturn = true;

    await repo.save(testService);

    assert(
      stubExistId.calls.length >= 1 || stubExistDisplayname.calls.length >= 1,
    );

    if (stubExistId.calls.length >= 1) {
      assertEquals(stubExistId.calls[0].args[0], id);
    }
    if (stubExistDisplayname.calls.length >= 1) {
      assertEquals(
        stubExistDisplayname.calls[0].args[0],
        testService.getDisplayName(),
      );
    }
    assertEquals(stubAdd.calls.length, 0);

    restoreStubs();
  });
  await t.step("If Service not exist", async () => {
    idReturn = false;
    displaynameReturn = false;

    await repo.save(testService);
    assertEquals(stubExistId.calls[0].args[0], id);
    assertEquals(
      stubExistDisplayname.calls[0].args[0],
      testService.getDisplayName(),
    );
    assertEquals(stubAdd.calls.length, 1);

    restoreStubs();
  });
});
