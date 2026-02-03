import { assertEquals, assertInstanceOf } from "@std/assert";
import { IdNameMap } from "../../src/classes/IdNameMap.ts";

Deno.test("IdNameMap", async (t) => {
  const map = new IdNameMap("123", "123");
  await t.step("Creation", () => {
    assertInstanceOf(map, IdNameMap);
    assertEquals(map.displayname, "123");
    assertEquals(map.id, "123");
    assertEquals(map.toString(), "123:123");
  });
  await t.step("valueclass methods", () => {
    const copy = map.copy();
    assertInstanceOf(copy, IdNameMap);
    assertEquals(copy.id, "123");
    assertEquals(copy.displayname, "123");
    assertEquals(copy.toString(), "123:123");
    const mwith = map.with({ "displayname": "321" });
    assertInstanceOf(copy, IdNameMap);
    assertEquals(mwith.id, "123");
    assertEquals(mwith.displayname, "321");
    assertEquals(mwith.toString(), "123:321");
  });
});
