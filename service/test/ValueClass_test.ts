import { assertFalse } from "@std/assert";
import { ServiceCredential } from "../src/classes/ServiceCredential.ts";

Deno.test("Value Class", async (t) => {
  const serviceCred1 = new ServiceCredential("hallo", "hallo2");
  const serviceCred2 = new ServiceCredential("hallo", "hallo2");
  await t.step("Equality", () => {
    assertFalse(!serviceCred1.equals(serviceCred2));
  });
});
