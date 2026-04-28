import { UserController } from "../../src/classes/controller/UserController.ts";
import { RamOnlyLog } from "../RamOnlyLog.ts";
import { TestUserRepo } from "../StubbedClasses/TestUserRepo.ts";
import { TestContext } from "../StubbedClasses/TestContext.ts";
import HonoCookieAdapter from "../../src/adapter/HonoCookieAdapter.ts";
import { stub } from "@std/testing/mock";
import { TestUser } from "../StubbedClasses/TestUser.ts";
import { assertEquals } from "@std/assert";
import { ConvertedUser } from "../../src/types/ConvertedUser.ts";
import { assertResponsesAndErrors } from "./assertResponsesAndErrors.ts";

Deno.test("UserController - Test", async (t) => {
  const goodReturn = "returned";
  const userRepo = TestUserRepo.create();
  const userController = new UserController(userRepo.this, new RamOnlyLog());
  let errorReturned = "errorReturned";
  //@ts-ignore protected member
  const errorHandleStub = stub(userController, "errorHandle", () => {
    return errorReturned;
  });
  const mockContext = TestContext.create();
  const mockedUser = TestUser.create();
  mockContext.registerOutput("get", mockedUser, true);
  let sessionToken: string;
  const cookieStub = stub(
    HonoCookieAdapter,
    "saveGetCookie",
    () => sessionToken,
  );
  await t.step("authMiddleware", async (st) => {
    await st.step("getCookie returns a session token", async () => {
      userRepo.reset();
      mockContext.reset();
      mockedUser.reset();
      sessionToken = "123";
      userRepo.registerOutput("findBySessionToken", mockedUser);
      let nextTriggered = false;
      await userController.authMiddleware(mockContext.this, () => {
        nextTriggered = true;
        return Promise.resolve();
      });
      assertEquals(nextTriggered, true);
      assertEquals(cookieStub.calls[0].args, [mockContext.this, "session"]);
      assertEquals(mockedUser.stub["validateSession"].args[0], [sessionToken]);
      assertEquals(userRepo.stub["findBySessionToken"].args[0], [sessionToken]);
    });
    await st.step("getCookie returns null", async () => {
      userRepo.reset();
      mockContext.reset();
      mockedUser.reset();
      sessionToken = "";
      userRepo.registerOutput("findBySessionToken", mockedUser);
      let nextTriggered = false;
      const returned = await userController.authMiddleware(
        mockContext.this,
        () => {
          nextTriggered = true;
          return Promise.resolve();
        },
      ) as unknown as string;
      assertEquals(returned, errorReturned);
      assertEquals(nextTriggered, false);
      assertEquals(cookieStub.calls[0].args, [mockContext.this, "session"]);
      assertEquals(errorHandleStub.calls[0].args[1], mockContext);
      assertEquals(userRepo.counter("findBySessionToken"), 0);
    });
  });
  await t.step("listMyServices", () => {
    mockedUser.reset();
    mockContext.reset();
    const listServiceReturn = ["asd"];
    mockedUser.registerOutput("listServices", listServiceReturn);
    mockContext.registerOutput("json", goodReturn);
    const returned = userController.listMyServices(
      mockContext.this,
    ) as unknown as string;
    assertEquals(returned, goodReturn);
    assertEquals(mockedUser.stub["listServices"].args[0], []);
    assertEquals(mockContext.lastArgs("json"), [listServiceReturn]);
  });
  await t.step("read", () => {
    mockedUser.reset();
    mockContext.reset();
    mockContext.registerOutput("json", goodReturn);
    mockedUser.registerOutput("toJson", { asd: "asd" });
    const returned = userController.read(mockContext.this) as unknown as string;
    assertEquals(returned, goodReturn);
    assertEquals(mockedUser.stub["toJson"].args[0], []);
    assertEquals(mockContext.lastArgs("json"), [{ asd: "asd" }]);
  });
  await t.step("change Password", async (st) => {
    await st.step("all good", async () => {
      const changedPassword = "changedPassword";
      mockedUser.reset();
      mockContext.reset();
      userRepo.reset();
      const password = "abc";
      mockContext.req.registerOutput("json", {
        credentials: {
          username: "not a password",
          password: password,
        } as ConvertedUser["credentials"],
      });
      mockedUser._credentials.registerOutput("changePassword", changedPassword);
      mockContext.registerOutput("body", goodReturn);
      const returned = await userController.changePassword(
        mockContext.this,
      ) as unknown as string;
      assertEquals(returned, goodReturn);
      assertEquals(mockedUser._credentials.stub["changePassword"].args[0], [
        password,
      ]);
      assertEquals(mockContext.lastArgs("body"), [null, 204]);
      assertEquals(userRepo.lastArgs("save"), [mockedUser]);
    });
  });
  await t.step("log out", async () => {
    mockedUser.reset();
    mockContext.reset();
    userRepo.reset();
    sessionToken = "123";
    const deleteCookieStub = stub(HonoCookieAdapter, "deleteCookie");
    mockContext.registerOutput("body", goodReturn);
    const returned = await userController.logOut(
      mockContext.this,
    ) as unknown as string;
    assertEquals(returned, goodReturn);
    assertEquals(mockedUser.stub["deleteSessionByToken"].args[0], [
      sessionToken,
    ]);
    assertEquals(cookieStub.calls[2].args, [mockContext.this, "session"]);
    assertEquals(deleteCookieStub.calls[0].args, [mockContext.this, "session"]);
    assertEquals(mockContext.lastArgs("body"), [null, 200]);
    assertEquals(userRepo.lastArgs("save"), [mockedUser]);
  });
  await t.step("all methods return errorHandle", async (st) => {
    sessionToken = "123";
    errorReturned = goodReturn;
    await st.step("user logged in required", async () => {
      while (errorHandleStub.calls.length) errorHandleStub.calls.pop();
      mockContext.reset(true);
      userRepo.reset();
      userRepo.registerOutput("findBySessionToken", mockedUser);
      const errorObject = new Error("generic");
      mockContext.registerOutput("get", errorObject, true);
      mockContext.registerOutput("set", errorObject);
      const returnedList: unknown[] = [];
      returnedList.push(
        userController.listMyServices(mockContext.this),
        await userController.logOut(mockContext.this),
        await userController.changeDisplayName(mockContext.this),
        await userController.changePassword(mockContext.this),
        await userController.delete(mockContext.this),
        userController.read(mockContext.this),
        await userController.authMiddleware(
          mockContext.this,
          () => Promise.resolve(),
        ),
      );
      assertResponsesAndErrors(
        returnedList,
        goodReturn,
        errorHandleStub,
        errorObject,
        mockContext as unknown as TestContext,
        mockedUser as unknown as TestUser,
      );
    });
  });
});
