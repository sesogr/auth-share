import { Model } from "@denodb";
import { Entity } from "../../../src/classes/Entity.ts";
import { DbRepository } from "../../../src/classes/Repositories/DenoDB/DbRepository.ts";
import { spy, stub } from "@std/testing/mock";
import { assert, assertFalse, assertGreater, assertRejects } from "@std/assert";
import { DbIdDisplayname } from "../../../src/classes/Repositories/DenoDB/Models/DbIdDisplayname.ts";
import { DuplicateError } from "../../../src/errors/DuplicateError.ts";

class TestDbrepository extends DbRepository {
  override async update(item: Entity): Promise<void> {
    return Promise.resolve();
  }
  override async add(item: unknown): Promise<void> {
    return Promise.resolve();
  }
}
class TModel extends Model {
}

Deno.test("DbRepository", async (t) => {
  let modelResponse: boolean[] | undefined[];
  let modelresponsenumber: number = 0;
  stub(TModel, "where", () => TModel);
  stub(
    TModel,
    "first",
    () => {
      const newLocal = Promise.resolve(
        modelResponse[modelresponsenumber],
      ) as unknown as Promise<
        TModel
      >;
      if (modelResponse.length - 1 != modelresponsenumber) {
        modelresponsenumber++;
      }
      return newLocal;
    },
  );
  const dbRepository = new TestDbrepository(
    TModel,
    "displayname",
    "id",
  );
  let mockData: { id?: string; displayname?: string } = {
    id: undefined,
    displayname: undefined,
  };
  const item = {
    getId: () => "123",
    getDisplayName: () => "Test User",
  } as unknown as Entity;
  stub(
    DbIdDisplayname,
    "first",
    () => Promise.resolve(mockData) as unknown as Promise<DbIdDisplayname>,
  );
  stub(DbIdDisplayname, "where", () => DbIdDisplayname);
  stub(DbIdDisplayname, "select", () => DbIdDisplayname);
  const updateStub = spy(dbRepository, "update");
  await t.step(
    "checkIdName returns true if id and displayname match",
    async () => {
      modelresponsenumber = 0;
      mockData = { id: "123", displayname: "Test User" };
      // Mock the DbIdDisplayname.where().select().select().first() method
      const result = await dbRepository.checkIdName(item);
      assert(result);
    },
  );
  await t.step(
    "checkIdName returns false if displayname does not match",
    async () => {
      modelresponsenumber = 0;
      mockData = { id: "123", displayname: "Wrong Name" };
      const result = await dbRepository.checkIdName(item);
      assertFalse(result);
    },
  );
  await t.step("checkIdName returns false if id does not exist", async () => {
    modelresponsenumber = 0;
    const result = await dbRepository.checkIdName(item);
    assertFalse(result);
  });
  await t.step("save calls add if id does not exist", async () => {
    modelresponsenumber = 0;

    const addStub = spy(dbRepository, "add");
    modelResponse = [false];
    await dbRepository.save(item);
    assertGreater(addStub.calls.length, 0);
  });
  await t.step(
    "save calls update if id exists but displayname differ",
    async () => {
      modelresponsenumber = 0;
      mockData = { id: "123", displayname: "TestUser" };
      modelResponse = [true, false];
      await dbRepository.save(item);
      assertGreater(updateStub.calls.length, 0);
    },
  );
  await t.step("save calls update if id exists ", async () => {
    modelresponsenumber = 0;
    mockData = { id: "123", displayname: "Test User" };
    modelResponse = [true, false];
    await dbRepository.save(item);
    assertGreater(updateStub.calls.length, 1);
  });
  await t.step(
    "save throws error if displayname is already there",
    async () => {
      modelresponsenumber = 0;
      mockData = { id: "123", displayname: "TestUser" };
      modelResponse = [true, true];
      await assertRejects(async () => {
        await dbRepository.save(item);
      }, DuplicateError);
    },
  );
  await t.step(
    "checkIdName returns false if id exist but displayname differ",
    async () => {
      modelresponsenumber = 0;
      mockData = { id: "123", displayname: "TestUser" };
      const result = await dbRepository.checkIdName(item);
      assertFalse(result);
    },
  );
  await t.step(
    "checkIdName returns false if id doesnt exist",
    async () => {
      modelresponsenumber = 0;
      mockData = { id: undefined, displayname: "TestUser" };
      const result = await dbRepository.checkIdName(item);
      assertFalse(result);
    },
  );
  await t.step(
    "checkIdName returns true ",
    async () => {
      modelresponsenumber = 0;
      mockData = { id: "123", displayname: "Test User" };
      const result = await dbRepository.checkIdName(item);
      assert(result);
    },
  );
});
