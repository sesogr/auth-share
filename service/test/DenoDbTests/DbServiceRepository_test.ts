import { DbServiceRepository } from "../../src/classes/Repositories/DenoDB/DbServiceRepository.ts";
import { FakeObjectGen } from "../../src/FakeObjectGen.ts";
import { stub } from "@std/testing/mock";
import { assert, assertEquals } from "@std/assert";

Deno.test("DbServiceRepository - Save()", async (t) => {
  const fakeService = FakeObjectGen.createFakeService();
  const id = fakeService.getId();
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
    restoreStubs();

    idReturn = true;
    displaynameReturn = true;

    await repo.save(fakeService);

    assert(
      stubExistId.calls.length >= 1 || stubExistDisplayname.calls.length >= 1,
    );

    if (stubExistId.calls.length >= 1) {
      assertEquals(stubExistId.calls[0].args[0], id);
    }
    if (stubExistDisplayname.calls.length >= 1) {
      assertEquals(
        stubExistDisplayname.calls[0].args[0],
        fakeService.getDisplayName(),
      );
    }
    assertEquals(stubAdd.calls.length, 0);
  });
  await t.step("If Service not exist", async () => {
    restoreStubs();
    idReturn = false;
    displaynameReturn = false;

    await repo.save(fakeService);
    assertEquals(stubExistId.calls[0].args[0], id);
    assertEquals(
      stubExistDisplayname.calls[0].args[0],
      fakeService.getDisplayName(),
    );
    assertEquals(stubAdd.calls.length, 1);
  });
});
