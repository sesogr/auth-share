import { assertThrows } from "@std/assert";
import HonoCookieAdapter from "../src/adapter/HonoCookieAdapter.ts";
import { TestContext } from "./StubbedClasses/TestContext.ts";

Deno.test("HonoCookieAdapter", () => {
  const mockContext = TestContext.create();
  mockContext.req.raw.headers.registerOutput("get", "testCookie:sadf");
  assertThrows(() => {
    HonoCookieAdapter.saveGetCookie(
      mockContext.this,
      "testCookie",
    );
  });
});
