import { spy } from "@std/testing/mock";
import { UserController } from "../../src/controller/UserController.ts";
import { assertEquals } from "@std/assert";
import { FakeObjectGen } from "../../src/FakeObjectGen.ts";
import { Context } from "@hono/hono";
import { UserRepository } from "../../src/interfaceTypes/UserRepository.ts";
import { UserCredential } from "../../src/classes/UserCredential.ts";

const context = {
  res: {
    headers: {
      set: () => true,
    },
  },
  req: {
    json: async () =>
      (await FakeObjectGen.createFakeUser("Hans Maiser", "wh234he")).toJson(),
  },
  //@ts-ignore any parameter
  body: (a, b) => {
    return { body: a, status: b };
  },
} as unknown as Context;

Deno.test("UserController - Test", async (t) => {
  await t.step("Create", async (st) => {
    await st.step("user is saved", async () => {
      const repo = {
        save: () => Promise.resolve(),
      } as unknown as UserRepository;
      const controller = new UserController(repo);
      const spySave = spy(repo, "save");
      const response = await controller.create(context);
      assertEquals(response?.body, null);
      assertEquals(response?.status, 201);
      assertEquals(spySave.calls.length, 1);
      assertEquals(
        spySave.calls[0].args[0].getCredentials().username,
        "Hans Maiser",
      );
    });
  });
  await t.step("Change Password", async (st) => {
    await st.step("password is changed", async () => {
      const repo = {
        findById: (id: string) => {
          const testUser = {
            changeUserCredentials: (a: UserCredential) => {
              testUser.username = a.username;
              testUser.password = a.hash;
            },
            username: "",
            password: "",
            getId: () => id,
            //getCredentials: () => testUser
            getCredentials: () => {
              return {
                username: testUser.username,
                password: testUser.password,
              };
            },
          };
          return Promise.resolve(testUser);
        },
        save: () => Promise.resolve(),
      } as unknown as UserRepository;

      //initieren des zu testenden Objects
      const controller = new UserController(repo);
      const spyFindByID = spy(repo, "findById");
      const spySave = spy(repo, "save");
      //start der zu testenden Methode mit folgenden assertions
      const response = await controller.changePassword(context);
      assertEquals(response?.body, null);
      assertEquals(response?.status, 204);
      assertEquals(spyFindByID.calls.length, 1);
      assertEquals(spySave.calls.length, 1);
      assertEquals(
        spySave.calls[0].args[0].getCredentials().hash,
        "wh234he",
      );
      assertEquals(spySave.calls[0].args[0].getId(), "123456");
    });
  });
});
