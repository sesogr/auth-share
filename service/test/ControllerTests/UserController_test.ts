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
import { User } from "../../src/classes/Entities/User.ts";
import { UserCredential } from "../../src/classes/Values/UserCredential.ts";
import { Environment } from "../../src/classes/Environment.ts";
import { CookieOptions } from "@hono/hono/utils/cookie";

function clearList(listToClear: { calls: unknown[] }) {
  while (listToClear.calls.length) listToClear.calls.pop();
}

Deno.test("UserController - Test", async (t) => {
  const goodReturn = "returned" as unknown;
  const userRepo = TestUserRepo.create();
  const userController = new UserController(userRepo.this, new RamOnlyLog());
  let errorReturned = "errorReturned" as unknown;
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
  const deleteCookieStub = stub(HonoCookieAdapter, "deleteCookie");
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
      );
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
    );
    assertEquals(returned, goodReturn);
    assertEquals(mockedUser.stub["listServices"].args[0], []);
    assertEquals(mockContext.lastArgs("json"), [listServiceReturn]);
  });
  await t.step("read", () => {
    mockedUser.reset();
    mockContext.reset();
    mockContext.registerOutput("json", goodReturn);
    mockedUser.registerOutput("toJson", { asd: "asd" });
    const returned = userController.read(mockContext.this);
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
      );
      assertEquals(returned, goodReturn);
      assertEquals(mockedUser._credentials.stub["changePassword"].args[0], [
        password,
      ]);
      assertEquals(mockContext.lastArgs("body"), [null, 204]);
      assertEquals(userRepo.lastArgs("save"), [mockedUser]);
    });
  });
  await t.step("create", async () => {
    userRepo.reset();
    mockedUser.reset();
    mockContext.reset();
    const credentials = { username: "username", password: "password" };
    const data = {
      displayname: "username",
      credentials: credentials as unknown as UserCredential,
    };
    mockContext.req.registerOutput("json", data);
    const createUserCredentialStub = stub(
      UserCredential,
      "create",
      () => Promise.resolve(data.credentials),
    );
    const createUserStub = stub(User, "createUser", () => mockedUser.this);
    mockContext.registerOutput("body", goodReturn);
    const returned = await userController.create(mockContext.this);
    assertEquals(returned, goodReturn);
    assertEquals(mockContext.lastArgs("body"), [null, 201]);
    assertEquals(createUserStub.calls[0].args, [
      data.credentials,
      data.displayname,
    ]);
    assertEquals(createUserCredentialStub.calls[0].args, [
      data.credentials.username,
      data.credentials.password,
    ]);
  });
  await t.step("log out", async () => {
    mockedUser.reset();
    mockContext.reset();
    userRepo.reset();
    sessionToken = "123";
    mockContext.registerOutput("body", goodReturn);
    const returned = await userController.logOut(
      mockContext.this,
    );
    assertEquals(returned, goodReturn);
    assertEquals(mockedUser.stub["deleteSessionByToken"].args[0], [
      sessionToken,
    ]);
    assertEquals(cookieStub.calls[2].args, [mockContext.this, "session"]);
    assertEquals(deleteCookieStub.calls[0].args, [mockContext.this, "session"]);
    assertEquals(mockContext.lastArgs("body"), [null, 200]);
    assertEquals(userRepo.lastArgs("save"), [mockedUser]);
  });
  await t.step("log in", async () => {
    mockContext.reset();
    userRepo.reset();
    mockedUser.reset();
    const credentials = { username: "username", password: "password" };
    const data = {
      credentials: credentials,
    };
    mockContext.req.registerOutput("json", data);
    userRepo.registerOutput("findByUserName", mockedUser.this);
    const mockedSession = { expiresAt: new Date() };
    const token = "token";
    mockedUser.registerOutput("createSession", {
      token: token,
      session: mockedSession,
    });
    Environment.FRONT_END_URL = "http";
    //@ts-ignore private
    Environment.checked = true;
    const cookieSetStub = stub(HonoCookieAdapter, "setCookie");
    const cookieMeta: CookieOptions = {
      domain: Environment.FRONT_END_URL,
      path: "/",
      secure: true,
      httpOnly: true,
      maxAge: 1000,
      expires: mockedSession.expiresAt,
      sameSite: "None" as const,
    };
    mockContext.registerOutput("json", goodReturn);
    mockedUser.registerOutput("getId", "123");
    mockedUser.registerOutput("getDisplayName", "username");
    const returned = await userController.logIn(mockContext.this);
    assertEquals(returned, goodReturn);
    assertEquals(cookieSetStub.calls[0].args, [
      mockContext.this,
      "session",
      token,
      cookieMeta,
    ]);
    assertEquals(mockContext.lastArgs("json"), [{
      id: "123",
      displayname: "username",
    }, 200]);
    assertEquals(userRepo.stub["save"].args[0], [mockedUser.this]);
    assertEquals(
      mockedUser._credentials.stub["verifyPasswordHash"].args[0][0],
      credentials.password,
    );
  });
  await t.step("change display name", async () => {
    mockedUser.reset();
    mockContext.reset();
    userRepo.reset();
    mockContext.req.registerOutput("json", { displayname: "displayname" });
    mockContext.registerOutput("body", goodReturn);
    const returned = await userController.changeDisplayName(mockContext.this);
    assertEquals(returned, goodReturn);
    assertEquals(mockedUser.lastArgs("setDisplayName"), ["displayname"]);
    assertEquals(userRepo.lastArgs("save"), [mockedUser.this]);
    assertEquals(mockContext.lastArgs("body"), [null, 204]);
  });
  await t.step("delete", async () => {
    mockedUser.reset();
    mockContext.reset();
    clearList(deleteCookieStub);
    mockContext.registerOutput("body", goodReturn);
    const returned = await userController.delete(mockContext.this);

    assertEquals(returned, goodReturn);
    assertEquals(userRepo.lastArgs("save"), [mockedUser.this]);
    assertEquals(mockContext.lastArgs("body"), [null, 204]);
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
    await st.step("user not needed to be logged in", async () => {
      //login, create
      clearList(errorHandleStub);
      mockContext.reset();
      userRepo.reset();
      const errorObject = new Error("generic");
      mockContext.req.registerOutput("json", errorObject, true);
      const returnedList: unknown[] = [];
      returnedList.push(
        await userController.logIn(mockContext.this),
        await userController.create(mockContext.this),
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
