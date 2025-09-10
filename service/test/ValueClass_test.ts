import { assertFalse } from "@std/assert";
import { ServiceCredential } from "../src/classes/ServiceCredential.ts";
import { UserCredential } from "../src/classes/UserCredential.ts";

Deno.test("testing valueclass", async (t) => {
  const serviceCred1 = new ServiceCredential("hallo", "hallo2");
  const serviceCred2 = new ServiceCredential("hallo", "hallo2");
  await t.step("Equality", () => {
    assertFalse(!serviceCred1.equals(serviceCred2));
  });
  await t.step("side note", () => {
    const userCred = new UserCredential("hallo", "hallo2");
    assertFalse(!userCred.equals(serviceCred1));
  });
});
