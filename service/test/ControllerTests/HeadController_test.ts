import { HeadController } from "../../src/classes/controller/HeadController.ts";
import { Context } from "@hono/hono";
import { RamOnlyLog } from "../RamOnlyLog.ts";
import { TestContext } from "../StubbedClasses/TestContext.ts";
import { FakeObjectGen } from "../../src/classes/FakeObjectGen.ts";
import { assertEquals, assertThrows } from "@std/assert";
import { SessionError } from "../../src/classes/errors/controllerErrors/SessionError.ts";
import { ControllerError } from "../../src/classes/errors/controllerErrors/ControllerError.ts";
import { ContentfulStatusCode } from "@hono/hono/utils/http-status";
import { Logger } from "../../interfaceTypes/Logger.ts";
import { ValidatedUser } from "../../interfaceTypes/ValidatedUser.ts";

class _unprotectHeadController extends HeadController {
  constructor(logging: Logger) {
    super(logging.withOwnContext("TestingHC"));
  }
  getLog() {
    return this.logging as RamOnlyLog;
  }
  unprotectGetMeFromContext(
    c: Context,
  ): ValidatedUser {
    return this.getMeFromContext(c);
  }
  unProtectedErrorHandle(error: unknown, c: Context) {
    return this.errorHandle(error, c);
  }
}
Deno.test("HeadController", async (t) => {
  const headController = new _unprotectHeadController(new RamOnlyLog());
  const ramLogger = headController.getLog();
  const context = TestContext.create();
  const user = await FakeObjectGen.createFakeUser();
  const statusCode = 1202 as ContentfulStatusCode;
  await t.step("getMeFromContext", async (st) => {
    await st.step("success full get", () => {
      context.reset();
      context.registerOutput("get", user);
      const me: ValidatedUser = headController.unprotectGetMeFromContext(
        context.this,
      );
      assertEquals(me, user);
      assertEquals(context.stub["get"]["args"][0][0], "currentUser");
    });
    await st.step("failure get", () => {
      context.reset();
      assertThrows(
        () => {
          headController.unprotectGetMeFromContext(context.this);
        },
        SessionError,
        "No user in context",
      );
    });
  });
  await t.step("error Handle", async (st) => {
    await st.step("ControllerError", () => {
      context.reset();
      ramLogger.reset();
      const error = new ControllerError(
        "test Message",
        statusCode,
      );
      headController.unProtectedErrorHandle(error, context.this);
      assertEquals(context.lastArgs("json"), [error, statusCode]);
      assertEquals(headController.getLog().logList[0], [
        "warn",
        [error],
        "TestingHC",
      ]);
    });
    await st.step("Internal Error", () => {
      context.reset();
      ramLogger.reset();
      const error = new Error("testMessage");
      headController.unProtectedErrorHandle(error, context.this);
      assertEquals(context.lastArgs("body"), [null, 500]);
      assertEquals(headController.getLog().logList[0], [
        "error",
        [error],
        "TestingHC",
      ]);
    });
    await st.step("not an error", () => {
      context.reset();
      ramLogger.reset();
      const someObject = {
        test: "test",
        test2: () => "test2",
        toString: () => "stringMethod",
      };
      headController.unProtectedErrorHandle(someObject, context.this);
      assertEquals(context.lastArgs("body"), [null, 500]);
      assertEquals(ramLogger.logList[0], [
        "error",
        [someObject],
        "TestingHC",
      ]);
    });
  });
});
