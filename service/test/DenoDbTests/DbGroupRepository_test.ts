import { stub } from "@std/testing/mock";
import { Group } from "../../src/classes/Group.ts";
import { DbGroupRepository } from "../../src/classes/Repositories/DenoDB/DbGroupRepository.ts";
import { DbGroup } from "../../src/classes/Repositories/DenoDB/Models/DbGroup.ts";
import { IdNameMap } from "../../src/classes/IdNameMap.ts";
import { assertEquals } from "@std/assert";

Deno.test("DbGroupRepository - Save()", async (t) => {
  const id = crypto.randomUUID();

  const item = new Group(
    "ReisegruppeAufgehtsAbgehts",
    new IdNameMap(id, "Hans Peter"),
    id,
  );
  await t.step("If Item already exist", async () => {
    const repo = new DbGroupRepository();
    const stubExistId = stub(repo, "existId", () => {
      return Promise.resolve(true);
    });
    const stubAdd = stub(repo, "add", () => Promise.resolve());
    await repo.save(item);

    assertEquals(stubExistId.calls[0].args[0], id);

    //watched ()
    assertEquals(stubExistId.calls.length, 1);
    assertEquals(stubAdd.calls.length, 0);

    stubExistId.restore();
    stubAdd.restore();
  });

  await t.step("If Item doesn't exist in Database", async () => {
    const repo = new DbGroupRepository();
    const stubExistId = stub(repo, "existId", () => {
      return Promise.resolve(false);
    });
    const stubAdd = stub(repo, "add", () => Promise.resolve());
    await repo.save(item);

    assertEquals(stubExistId.calls.length, 1);
    assertEquals(stubAdd.calls.length, 1);

    stubExistId.restore();
    stubAdd.restore();
  });
});

Deno.test("ExistId", async () => {
  const repo = new DbGroupRepository();
  const testGroupId = "62787485749";
  const stub2 = stub(
    DbGroup,
    "first",
    () => Promise.resolve(true as unknown as DbGroup),
  );
  const stubWhere = stub(DbGroup, "where", () => DbGroup);
  //call for existID
  const result = await repo.existId(testGroupId);

  assertEquals(result, true);
  assertEquals(stubWhere.calls.length, 1);
  //@ts-ignore overload issue
  assertEquals(stubWhere.calls[0].args[1], testGroupId);
  assertEquals(stub2.calls.length, 1);
});
