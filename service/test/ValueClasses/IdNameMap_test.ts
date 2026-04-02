import { assertEquals, assertInstanceOf, assertThrows } from "@std/assert";
import { IdNameMap } from "../../src/classes/Values/IdNameMap.ts";

Deno.test("IdNameMap", async (t) => {
  const [id, name] = ["123", "1234"];
  const map = new IdNameMap(id, name);
  await t.step("Creation", () => {
    assertInstanceOf(map, IdNameMap);
    assertEquals(map.displayname, name);
    assertEquals(map.id, id);
    assertEquals(map.toString(), `${id}:${name}`);
    assertThrows(() => {
      map.dfj = 123;
    }, TypeError);
  });
});
