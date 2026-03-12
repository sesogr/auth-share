import { stub } from "@std/testing/mock";
import { DbGroupRepository } from "../../../src/classes/Repositories/DenoDB/DbGroupRepository.ts";
import { DbGroup } from "../../../src/classes/Repositories/DenoDB/Models/DbGroup.ts";
import { assertEquals } from "@std/assert";

Deno.test("DbGroupRepository - Save()", async (t) => {
  await t.step("ExistId", async () => {
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
});
