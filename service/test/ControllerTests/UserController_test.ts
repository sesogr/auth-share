import { spy, stub } from "@std/testing/mock";
import { UserController } from "../../src/classes/controller/UserController.ts";
import { assertEquals } from "@std/assert";
import { FakeObjectGen } from "../../src/classes/FakeObjectGen.ts";
import { Context } from "@hono/hono";
import { UserRepository } from "../../interfaceTypes/UserRepository.ts";
import { UserCredential } from "../../src/classes/Values/UserCredential.ts";
import { ConvertedUser } from "../../types/ConvertedUser.ts";
import { User } from "../../src/classes/Entities/User.ts";
import { Logger } from "../../interfaceTypes/Logger.ts";

const context = {
  res: {
    headers: {
      set: () => true,
    },
  },
  req: {
    json: () => {
      return Promise.resolve({
        displayname: "Hans Maiser",
        credentials: {
          username: "Hans Maiser",
          password: "wh234he",
        },
      } as ConvertedUser);
    },
  },
  //@ts-ignore any parameter
  body: (a, b) => {
    return { body: a, status: b };
  },
  //@ts-ignore any parameter
  json: (a, b) => context.body(a, b),
} as unknown as Context;

Deno.test("UserController - Test", async (t) => {
  const logger = {} as Logger;
  await t.step("Create", async (st) => {
    await st.step("user is saved", async () => {
      const repo = {
        save: () => Promise.resolve(),
      } as unknown as UserRepository;
      const controller = new UserController(repo, logger);
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
    await st.step("invalid request data", async () => {
      const controller = new UserController(
        {} as unknown as UserRepository,
        {} as Logger,
      );
      const contextWithInvalidData = {
        ...context,
        req: {
          json: () => {
            return { "ha": "be" } as unknown as Promise<ConvertedUser>;
          },
        },
      } as unknown as Context;

      const returnbody = await controller.create(contextWithInvalidData);
      assertEquals(returnbody.status, 400);
      //@ts-ignore body is different
      assertEquals(returnbody.body.message, "Wrong Keys Detected");
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
                changePassword: (newPassword: string) => {
                  testUser.username = newPassword.split(":")[0];
                  testUser.password = newPassword.split(":")[1];
                },
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
      const controller = new UserController(repo, logger);
      const spySave = spy(repo, "save");
      const user: User = await FakeObjectGen.createFakeUser();
      const stubChangeUserCredentials = stub(
        user,
        "changeUserCredentials",
        (a: UserCredential) => {
          //@ts-ignore override private member
          user.getCredentials = () => a;
        },
      );
      //@ts-ignore protected member
      const stubGetMe = stub(controller, "getMeFromContext", () => {
        //@ts-ignore override private method
        user.validateSession = () => user.validated = true;
        user.validateSession("");
        return user;
      });
      //start der zu testenden Methode mit folgenden assertions
      const response = await controller.changePassword(context);
      assertEquals(response?.body, null);
      assertEquals(response?.status, 204);
      assertEquals(spySave.calls.length, 1);
      assertEquals(stubGetMe.calls.length, 1);
      assertEquals(
        spySave.calls[0].args[0].getCredentials().hash,
        stubChangeUserCredentials.calls[0].args[0].hash,
      );
      assertEquals(spySave.calls[0].args[0].getId(), user.getId());
    });
  });
});
