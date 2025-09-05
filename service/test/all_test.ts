import { groupTestDefinition } from "./Group_test.ts";

Deno.test("All", async (t) => {
  await t.step("Group", groupTestDefinition);
});
