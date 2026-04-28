import { assertEquals, assertThrows } from "@std/assert";
import { RamOnlyLog } from "./RamOnlyLog.ts";

Deno.test("RamOnlyLog", () => {
  const ramOnlyLog = new RamOnlyLog();
  ramOnlyLog.withOwnContext("secondContext");
  const secondContext = ramOnlyLog.findLoggerByContext("secondContext");
  assertThrows(() => {
    ramOnlyLog.findLoggerByContext("");
  });
  secondContext.log("test");

  assertEquals(secondContext.logList, [["info", ["test"], "secondContext"]]);
  secondContext.debug("test");
  assertEquals(secondContext.logList, [["info", ["test"], "secondContext"], [
    "debug",
    [
      "test",
    ],
    "secondContext",
  ]]);
  secondContext.error("test");
  assertEquals(secondContext.logList, [["info", ["test"], "secondContext"], [
    "debug",
    [
      "test",
    ],
    "secondContext",
  ], ["error", ["test"], "secondContext"]]);
  secondContext.warn("test", "test2");
  assertEquals(secondContext.logList, [
    ["info", ["test"], "secondContext"],
    ["debug", [
      "test",
    ], "secondContext"],
    ["error", ["test"], "secondContext"],
    ["warn", ["test", "test2"], "secondContext"],
  ]);
  secondContext.reset();
  assertEquals(secondContext.logList, []);
});
