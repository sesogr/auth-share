import { groupTestContext } from "./Group_test.ts";

Deno.test("All", async (t) => {
  await t.step("Group", groupTestContext);
});
