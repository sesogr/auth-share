import { assertEquals } from "@std/assert";
import { Entity } from "../../src/classes/Entity.ts";
import { IdNameMap } from "../../src/classes/Values/IdNameMap.ts";

Deno.test("Entity", async (t) => {
  await t.step("creation", () => {
    const [displayname, id] = ["abc", "123"];
    const ent = new Entity(id, displayname, "");
    assertEquals(ent.getDisplayName(), displayname);
    assertEquals(ent.getId(), id);
    assertEquals(ent.convertToShort(), new IdNameMap(id, displayname));
  });
});
