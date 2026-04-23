import { assertEquals } from "@std/assert";
import { TestContext } from "../StubbedClasses/TestContext.ts";
import { TestUser } from "../StubbedClasses/TestUser.ts";

export function assertResponsesAndErrors(
  returned: unknown[],
  goodReturn: unknown,
  errorHandleStub: { calls: { args: unknown[] }[] },
  errorObject: Error,
  mockContext: TestContext,
  fakeMe: TestUser,
) {
  function createListWithCountOfMethodCalls<K>(returned1: K): K[] {
    return [...returned].map((_) => returned1);
  }

  assertEquals(returned, createListWithCountOfMethodCalls(goodReturn));
  assertEquals(
    errorHandleStub.calls.length,
    returned.length,
  );
  assertEquals(
    errorHandleStub.calls.map((e) => e.args),
    createListWithCountOfMethodCalls([errorObject, mockContext]),
  );
  mockContext.reset(true);
  mockContext.registerOutput("get", fakeMe, true);
}
