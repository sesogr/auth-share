import { stub } from "@std/testing/mock";
import { DbUserRepository } from "../../src/classes/Repositories/DenoDB/DbUserRepository.ts";
import { UserController } from "../../src/controller/UserController.ts";
import { assertEquals } from "@std/assert";
import { FakeObjectGen } from "../../src/FakeObjectGen.ts";
import { Context } from "@hono/hono";

Deno.test("UserController - Test", async (t) => {
  await t.step("Create", async (st) => {
    await st.step("user is saved", async () => {
      const repo = new DbUserRepository();
      const controller = new UserController(repo, "");
      const stubSave = stub(repo, "save", () => {
        return Promise.resolve();
      });
      const response = await controller.create(context);
      assertEquals(response?.body, null);
      assertEquals(response?.status, 201);
      assertEquals(stubSave.calls.length, 1);
      assertEquals(
        stubSave.calls[0].args[0].getCredentials().username,
        "Hans Maiser",
      );
    });
  });
});
//assertions to make!
const context = {
  res: {
    headers: {
      set: () => true,
    },
  },
  req: {
    json: () => FakeObjectGen.createFakeUser("Hans Maiser").toJson(),
  },
  //@ts-ignore any parameter
  body: (a, b) => {
    return { body: a, status: b };
  },
} as unknown as Context;
