import { UserController } from "../../src/classes/controller/UserController.ts";
import { RamOnlyLog } from "../RamOnlyLog.ts";
import { TestUserRepo } from "../StubbedClasses/TestUserRepo.ts";
import { TestContext } from "../StubbedClasses/TestContext.ts";
import HonoCookieAdapter from "../../src/adapter/HonoCookieAdapter.ts";
import { stub } from "@std/testing/mock";
import { TestUser } from "../StubbedClasses/TestUser.ts";
import { assertEquals } from "@std/assert";
import { ConvertedUser } from "../../src/types/ConvertedUser.ts";

Deno.test("UserController - Test", async (t) => {
  const goodReturn = "returned";
  const userRepo = TestUserRepo.create();
  const userController = new UserController(userRepo, new RamOnlyLog());
  const errorReturned = "errorReturned";
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
      await userController.authMiddleware(mockContext, () => {
        nextTriggered = true;
        return Promise.resolve();
      });
      assertEquals(nextTriggered, true);
      assertEquals(cookieStub.calls[0].args, [mockContext, "session"]);
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
      const returned = await userController.authMiddleware(mockContext, () => {
        nextTriggered = true;
        return Promise.resolve();
      }) as unknown as string;
      assertEquals(returned, errorReturned);
      assertEquals(nextTriggered, false);
      assertEquals(cookieStub.calls[0].args, [mockContext, "session"]);
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
      mockContext,
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
    const returned = userController.read(mockContext) as unknown as string;
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
        mockContext,
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
    userRepo.registerOutput("findBySessionToken", mockedUser);
    mockContext.registerOutput("body", goodReturn);
    const returned = await userController.logOut(
      mockContext,
    ) as unknown as string;
    assertEquals(returned, goodReturn);
    assertEquals(userRepo.lastArgs("findBySessionToken"), [sessionToken]);
    assertEquals(mockedUser.stub["deleteSessionByToken"].args[0], [
      sessionToken,
    ]);
    assertEquals(cookieStub.calls[2].args, [mockContext, "session"]);
    assertEquals(deleteCookieStub.calls[0].args, [mockContext, "session"]);
    assertEquals(mockContext.lastArgs("body"), [null, 200]);
    assertEquals(userRepo.lastArgs("save"), [mockedUser]);
  });
});
