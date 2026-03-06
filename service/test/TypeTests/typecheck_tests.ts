import { assertThrows } from "@std/assert";
import { checkForAdditionalKeys } from "../../src/types/types.ts";
import { FormlessError } from "../../src/errors/controllerErrors/FormlessError.ts";

Deno.test("Typechecks", async (t) => {
  await t.step("checkForAdditionalKeys", async (st) => {
    await st.step("approved", () => {
      const testvalue = { hallo: { hallo2: "welt" } };
      const allkeys = ["hallo", "shdlfj"];
      checkForAdditionalKeys(testvalue, allkeys);
    });
    await st.step("throws", () => {
      const testvalue = { hallo: { hallo2: "welt" }, hallo3: "jdsklfj" };
      const allkeys = ["hallo", "shdlfj"];
      assertThrows(
        () => checkForAdditionalKeys(testvalue, allkeys),
        FormlessError,
      );
    });
  });
});
